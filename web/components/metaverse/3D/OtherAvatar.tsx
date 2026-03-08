"use client";
import { PartsCategory } from "@/generated/prisma/enums";
import { UserData, UserId } from "@/types/user";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationAction, Group, Skeleton } from "three";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import Parts from "./Parts";
import OtherAvatarHtml from "./OtherAvatarHtml";

const OtherAvatar = ({
  playerId,
  othersRef,
}: {
  playerId: UserId;
  othersRef: React.RefObject<Map<UserId, UserData>>;
}) => {
  const avatarRef = useRef<Group>(null!);
  const playerDataRef = useRef<UserData>(null!);
  const [showMenu,setShowMenu]=useState(false);

  // ---- lerp用ターゲット値 ----
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotationY = useRef(0);

  // 初期データを取得
  const initialPlayerData = othersRef.current?.get(playerId);
  if (initialPlayerData) {
    playerDataRef.current = initialPlayerData;
  }

  const { avatarConfig } = playerDataRef.current;
  const { scene } = useGLTF("/models/Armature.glb");

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const nodes = useMemo(() => {
    const nodeMap: any = {};
    clonedScene.traverse((child) => {
      if (child.name) nodeMap[child.name] = child;
    });
    return nodeMap;
  }, [clonedScene]);

  const { animations: idleAnimations } = useGLTF("/models/Idle.glb");
  const { animations: walkingAnimations } = useGLTF("/models/Walking.glb");

  const avatarAnimations = useMemo(() => {
    const idle = idleAnimations.map((a) => a.clone());
    const walk = walkingAnimations.map((a) => a.clone());
    idle[0].name = "Idle";
    walk[0].name = "Walking";
    return [...idle, ...walk];
  }, [idleAnimations, walkingAnimations]);

  const { actions } = useAnimations(avatarAnimations, avatarRef);
  const actionRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    actions["Idle"]?.play();
    actionRef.current = actions["Idle"];

    return () => {
      actions["Idle"]?.stop();
      actionRef.current = null;
    };
  }, [actions]);

  useFrame(() => {
    if (!avatarRef.current) return;

    // 毎フレーム最新のプレイヤーデータを取得
    const latestPlayerData = othersRef.current?.get(playerId);
    if (!latestPlayerData) return;

    playerDataRef.current = latestPlayerData;

    // ---- ターゲット値を更新 ----
    targetPosition.current.set(
      latestPlayerData.position.x,
      latestPlayerData.position.y,
      latestPlayerData.position.z,
    );
    targetRotationY.current = latestPlayerData.rotationY;

    // ---- lerp で滑らかに補間（0.15: 小さいほど滑らか・遅延大） ----
    avatarRef.current.position.lerp(targetPosition.current, 0.15);
    avatarRef.current.rotation.y = THREE.MathUtils.lerp(
      avatarRef.current.rotation.y,
      targetRotationY.current,
      0.15,
    );

    // Walking判定（サーバーから送られてくる想定）
    const isWalking = latestPlayerData.isWalking;
    const action = isWalking ? actions["Walking"] : actions["Idle"];

    if (actionRef.current !== action) {
      actionRef.current?.fadeOut(0.2);
      action?.reset().fadeIn(0.2).play();
      actionRef.current = action;
    }
  });

  return (
    <group ref={avatarRef} dispose={null}>
      <group position={[0, 0, 0]} scale={1.8}>
        <group name="Scene">
          <group name="Armature" scale={0.01} rotation-x={Math.PI / 2}>
            <primitive object={nodes.mixamorigHips} />

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
                      avatarSkeleton={(nodes.Plane as any).skeleton as Skeleton}
                    />
                  </Suspense>
                ) : null;
              },
            )}
          </group>
        </group>

        {/* 当たり判定用のボックス */}
        <mesh
          onClick={() => setShowMenu((sm) => !sm)}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
          position-y={1.2}
        >
          <boxGeometry args={[1.2, 2, 1.2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
      <OtherAvatarHtml playerRef={playerDataRef} showMenu={showMenu} setShowMenu={setShowMenu}/>
    </group>
  );
};

export default OtherAvatar;