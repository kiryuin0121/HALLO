"use client";
import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import { PartsCategory } from "@/generated/prisma/enums";
import { UserData } from "@/types/user";
import {
  useAnimations,
  useFBX,
  useGLTF,
  useKeyboardControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { AnimationAction, Group, Vector3, Skeleton } from "three";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import Parts from "./Parts";
import AvatarHtml from "./AvatarHtml";
import { selfAtom } from "./Players";

const CAMERA_CONFIG = {
  offset: new Vector3(0, 3, -7), //カメラの視座は、アバターの上へ3マス、後ろに7マスの位置とする。
  lookAtOffset: new Vector3(0, 3, 0), //カメラの視点は、アバターの上へ3マスの位置とする。
}; //カメラの設定

const ROTATION_SPEED = 3; //回転の速さ
const WALKING_SPEED = 8; //移動の速さ

const MIN_DISPLACEMENT = 0.1; //1フレームあたりの変位がこれを超えたら、WSサーバーへデータを送信する。
const MIN_ARGUMENT = 0.1; //1フレームあたりの偏角がこれを超えたら、WSサーバーへデータを送信する。

const MyAvatar = ({ playerRef }: { playerRef: React.RefObject<UserData> }) => {
  // アバターを背後から映し出すカメラ
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!); //カメラへの参照
  const lookAtPositionRef = useRef(new Vector3()); //カメラの視点(x,y,z)

  // アバターの3Dモデルを読み込む。
  const avatarRef = useRef<Group>(null!); //アバターへの参照
  // const avatarConfig = playerRef.current?.avatarConfig; //アバターのパーツ着用設定
  const self = useAtomValue(selfAtom);
  const avatarConfig = playerRef.current?.avatarConfig || self?.avatarConfig;
  // console.log(avatarConfig);
  const { scene } = useGLTF("/models/Armature.glb");

  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);

  const nodes = useMemo(() => {
    const nodeMap: any = {};
    clonedScene.traverse((child) => {
      if (child.name) {
        nodeMap[child.name] = child;
      }
    });
    return nodeMap;
  }, [clonedScene]);

  // アバターに適用させるモーションを読み込む。
  const { animations: idleAnimations } = useGLTF("/models/Idle.glb");
  const { animations: walkingAnimations } = useGLTF("/models/Walking.glb");
  // const { animations: idleAnimations } = useFBX("/models/Idle2.fbx");
  // const { animations: walkingAnimations } = useFBX("/models/Walking.fbx");
  const avatarAnimations = useMemo(() => {
    // アニメーションも複製
    const clonedIdleAnimation = idleAnimations.map((anim) => anim.clone());
    const clonedWalkingAnimation = walkingAnimations.map((anim) =>
      anim.clone(),
    );
    clonedIdleAnimation[0].name = "Idle";
    clonedWalkingAnimation[0].name = "Walking";
    return [...clonedIdleAnimation, ...clonedWalkingAnimation];
  }, [idleAnimations, walkingAnimations]);
  const { actions } = useAnimations(avatarAnimations, avatarRef);
  const actionRef = useRef<AnimationAction | null>(null); //現在アバターに適用されているモーション(Idle,Walking...)

  // アプリ全体で使いまわすsocket.ioインスタンスを取得する。
  const socket = useAtomValue(socketAtom);
  // WSサーバーへ送信した位置＆回転データ
  const socketData = useRef({
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotationY: 0,
    isWalking: false,
  });
  // キー入力の状態を取得する関数
  const [, get] = useKeyboardControls();

  // 位置＆回転情報を初期化する。
  useEffect(() => {
    // 位置
    avatarRef.current.position.set(
      playerRef.current?.position.x,
      playerRef.current?.position.y,
      playerRef.current?.position.z,
    );
    // 回転
    avatarRef.current.rotation.y = playerRef.current?.rotationY;

    // カメラ初期位置もアバターの初期位置に合わせて設定する。
    const initialOffset = CAMERA_CONFIG.offset
      .clone()
      .applyQuaternion(avatarRef.current.quaternion);
    cameraRef.current.position.copy(
      avatarRef.current.position.clone().add(initialOffset),
    );

    socketData.current = {
      position: {
        x: playerRef.current?.position.x,
        y: playerRef.current?.position.y,
        z: playerRef.current?.position.z,
      },
      rotationY: playerRef.current?.rotationY,
      isWalking: false,
    };
  }, []);

  // アバターに初期モーション(Idle)を適用する。
  useEffect(() => {
    actions["Idle"]?.play();
    actionRef.current = actions["Idle"];
    return () => {
      actions["Idle"]?.stop();
      actionRef.current = null;
    };
  }, [actions]);

  const targetPosition = useRef(new Vector3());
  const targetRotationY = useRef(0);
  const walkingDirection = useRef(new Vector3());

  /* 
  ・キー入力によって、アバターの位置＆回転を制御する。
  ・アバターに適用するモーションを切り替える。
  ・カメラの視座＆視点を制御する。
  ・WSサーバーへアバターの座標＆回転データを送信する。
  */
  useFrame((_, delta) => {
    if (!avatarRef.current) return;

    // 十字キーの入力状態を取得する。
    const { forward, back, left, right } = get();

    /* 
      キー入力によってアバターの移動＆回転を行う。
    */
    // 回転
    if (left) avatarRef.current.rotation.y += ROTATION_SPEED * delta;
    if (right) avatarRef.current.rotation.y -= ROTATION_SPEED * delta;

    // 移動
    // アバターの進行方向を取得する。
    walkingDirection.current
      .set(0, 0, 1)
      .applyQuaternion(avatarRef.current.quaternion);
    // const walkingDirection = new Vector3(0, 0, 1).applyQuaternion(
    //   avatarRef.current.quaternion,
    // );
    if (forward)
      avatarRef.current.position.addScaledVector(
        walkingDirection.current,
        WALKING_SPEED * delta,
      );
    if (back)
      avatarRef.current.position.addScaledVector(
        walkingDirection.current,
        -WALKING_SPEED * delta,
      );

    const avatarPositon = avatarRef.current.position; //アバターの座標
    const avatarRotationY = avatarRef.current.rotation.y; //アバターの回転

    /* 
      キー入力によってアバターに適用するモーションを切り替える。
    */
    const isWalking = forward || back || left || right;
    const action = isWalking ? actions["Walking"] : actions["Idle"];
    if (actionRef.current !== action) {
      actionRef.current?.fadeOut(0.2);
      action?.reset().fadeIn(0.2).play();
      actionRef.current = action;
    }

    /* 
      カメラをアバターの背後へと追従させる。
    */
    // カメラの視座を計算する。(アバターの後ろ)
    const offset = CAMERA_CONFIG.offset
      .clone()
      .applyQuaternion(avatarRef.current.quaternion);
    const cameraPositon = avatarPositon.clone().add(offset);

    // カメラの視点を計算する。(アバターの頭上)
    const lookAtOffset = CAMERA_CONFIG.lookAtOffset
      .clone()
      .applyQuaternion(avatarRef.current.quaternion);
    const lookAtPosition = avatarPositon.clone().add(lookAtOffset);
    lookAtPositionRef.current.lerp(lookAtPosition, 0.1);

    // カメラへ計算した視座と視点を適用する。
    cameraRef.current.position.lerp(cameraPositon, 0.1); //視座
    cameraRef.current.lookAt(lookAtPositionRef.current); //視点

    /* 
      WSサーバーへアバターの位置＆角度データを送信する。
    */

    // 変位(>=0)を計算する。
    const displacement = avatarPositon.distanceTo(
      new Vector3(
        socketData.current.position.x,
        socketData.current.position.y,
        socketData.current.position.z,
      ),
    );
    // 偏角(>=0)を計算する。
    const argument = Math.abs(avatarRotationY - socketData.current.rotationY);

    // isWalkingの状態が変わった場合も送信する
    const isActionChange = socketData.current.isWalking !== isWalking;

    // 前回WSサーバーへ送信したデータに対して、十分な変位・偏角、またはisWalkingの変化がある場合のみ、データを送信する。
    if (
      displacement >= MIN_DISPLACEMENT ||
      argument >= MIN_ARGUMENT ||
      isActionChange
    ) {
      socket?.emit("self-move", {
        ...playerRef.current,
        position: {
          x: avatarPositon.x,
          y: avatarPositon.y,
          z: avatarPositon.z,
        },
        rotationY: avatarRotationY,
        isWalking,
      });

      socketData.current = {
        position: {
          x: avatarPositon.x,
          y: avatarPositon.y,
          z: avatarPositon.z,
        },
        rotationY: avatarRotationY,
        isWalking,
      };
      // console.log(avatarPositon);
    }
  });
  return (
    <>
      {/* アバターを背後から映し出すカメラ */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, CAMERA_CONFIG.offset.y, CAMERA_CONFIG.offset.z]}
        fov={63}
        near={0.01}
        far={1000}
      />

      {/* アバターの3Dモデル */}
      <group
        ref={avatarRef}
        // onClick={() => setIsOpen((isOpen) => !isOpen)}
        dispose={null}
      >
        <group position={[0, 0, 0]} scale={1.8}>
          <group name="Scene">
            <group name="Armature" scale={0.01} rotation-x={Math.PI / 2}>
              {/* アニメーション用のスケルトンを配置*/}
              <primitive object={nodes.mixamorigHips} />

              {/* avatarConfigのカテゴリ名(key)に紐づくオブジェクト(value)にpartsが設定されていれば、Avatar本体に装着する。 */}
              {(Object.keys(avatarConfig) as PartsCategory[]).map(
                (categoryName) => {
                  const avatarConfigValue = avatarConfig[categoryName];
                  const parts = avatarConfigValue?.parts;
                  const isRender = !!(parts && parts.model);
                  return isRender ? (
                    <Suspense key={parts.id}>
                      <Parts
                        avatarConfig={avatarConfig}
                        categoryName={categoryName}
                        model={parts.model}
                        avatarSkeleton={
                          (nodes.Plane as any).skeleton as Skeleton
                        } //漢はanyで黙らせるッッ!!!
                      />
                    </Suspense>
                  ) : null;
                },
              )}
            </group>
          </group>
        </group>

        {/* アバターの周りに表示するHtml */}
        <AvatarHtml playerRef={playerRef} />
      </group>
    </>
  );
};

export default MyAvatar;
