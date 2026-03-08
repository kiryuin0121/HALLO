"use client";

import { PartsCategory } from "@/generated/prisma/enums";
import { AvatarConfig } from "@/types/avatar";
import { useAnimations, useGLTF } from "@react-three/drei";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { AnimationAction, Group, Vector3, Skeleton } from "three";

import { SkeletonUtils } from "three-stdlib";
import Parts from "./Parts";

const ProfileAvatar = ({ avatarConfig }: { avatarConfig: AvatarConfig }) => {
  // アバターの3Dモデルを読み込む。
  const avatarRef = useRef<Group>(null!); //アバターへの参照
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

  const avatarAnimations = useMemo(() => {
    // アニメーションも複製
    const clonedIdleAnimation = idleAnimations.map((anim) => anim.clone());

    clonedIdleAnimation[0].name = "Idle";

    return [...clonedIdleAnimation];
  }, [idleAnimations]);
  const { actions } = useAnimations(avatarAnimations, avatarRef);
  const actionRef = useRef<AnimationAction | null>(null); //現在アバターに適用されているモーション(Idle,Walking...)

  // アバターに初期モーション(Idle)を適用する。
  useEffect(() => {
    actions["Idle"]?.play();
    actionRef.current = actions["Idle"];
    return () => {
      actions["Idle"]?.stop();
      actionRef.current = null;
    };
  }, [actions]);

  return (
    <>
      {/* アバターの3Dモデル */}
      <group ref={avatarRef} dispose={null}>
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
                      avatarSkeleton={(nodes.Plane as any).skeleton as Skeleton} //漢はanyで黙らせるッッ!!!
                    />
                  </Suspense>
                ) : null;
              },
            )}
          </group>
        </group>
      </group>
    </>
  );
};

export default ProfileAvatar;
