"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useAnimations,  useGLTF } from "@react-three/drei";
import { useAtomValue} from "jotai";
import { avatarConfigAtom } from "@/atoms/avatar";

import { Group, Skeleton } from "three";
import { PartsCategory } from "@/generated/prisma/enums";
import { AvatarConfigValue } from "@/types/avatar";
import { SkeletonUtils } from "three-stdlib";
import Parts from "@/components/metaverse/3D/Parts";

const Avatar = () => {
  const avatarRef = useRef<Group>(null!); //アバターへの参照
  const avatarConfig = useAtomValue(avatarConfigAtom);//アバターのパーツ装着状態リスト
 
  // アバターの3dモデルを読み込む。
  const { scene } = useGLTF("/models/Armature.glb");
  /* 
  アバターのモデルデータ全体をまるごと複製する。(他の場所でも同じ3dモデルをロードするので、お互いに干渉するのを防止する)
  clone処理は負荷高めらしいので結果をmemo化する。
  */
  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);
  // アバターのnodesを生成する。nodesが何かはわからない。gltfjsxで自動生成されたコードでnodesを使用していたので、これに合わせておく。
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
  const { animations } = useGLTF("/models/Idle.glb");

  // モーションデータを複製する。(モデルデータと同様で他の場所でもロードするので、互いの干渉を防止する。)
  const avatarAnimations = useMemo(() => {
    const clonedIdleAnimation = animations.map((anim) => anim.clone());
    clonedIdleAnimation[0].name = "Idle"; //わかりやすいようにアニメーションにIdleと命名。
    return [...clonedIdleAnimation];
  }, [animations]);

  // アバターとモーションを紐づける。
  const { actions } = useAnimations(avatarAnimations, avatarRef);

  // Idleモーションを再生する。
  useEffect(() => {
    actions["Idle"]?.play();
  }, [actions]);


  if (!avatarConfig) {
    console.log("avatarConfigが初期化されていません");
    return null;
  }

  return (
    <group ref={avatarRef} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          {/* 
            なぜ <primitive object={nodes.mixamorigHips} />(=アニメーションを行うための骨格)が必要か？
            ・アニメーションの仕組み：内部的にそれぞれの骨(Bone)の角度データを更新することで実現。逆説的に言うと、Boneがないとアニメーションは成立しない。
            ・mixamorigHips：Boneの集合のうち最上位に位置するもの(ルートボーン)。ルートボーンを起点に、その他すべての骨(Bone)が階層的にぶら下がっている。ルートボーンから下を根こそぎグルーピングしたものがSkelton(骨格)。
            →
            ・アニメーションを行う際は、3d空間(scene)にSkelton(骨格)を追加する必要がある。(<primitive object={nodes.mixamorigHips} />)
          */}
          <primitive object={nodes.mixamorigHips} />

          {/* 
            node.Plane.skeleton(=アバター全体の骨格)と<primitive object={nodes.mixamorigHips} />(=アニメーションを行うための骨格)の関係
            ・<primitive object={nodes.mixamorigHips} />∁node.Plane.skeleton(補集合のような関係)
          */}

          {/* 
            Avatarが身に着けているパーツを表示する。avatarConfigのkey(パーツの種類)に紐づくオブジェクトにpartsが設定されていれば描画。
          */}
          {(Object.keys(avatarConfig) as PartsCategory[]).map((key) => {
            const avatarConfigValue = avatarConfig[key] as AvatarConfigValue;
            const parts = avatarConfigValue.parts;
            const isRender = !!(parts && parts.model);
            return isRender ? (
              <Suspense key={parts.id}>
                <Parts
                  avatarConfig={avatarConfig}
                  categoryName={key}
                  model={parts.model}
                  avatarSkeleton={(nodes.Plane as any).skeleton as Skeleton} //漢はanyで黙らせるッッ!!!
                />
              </Suspense>
            ) : null;
          })}
        </group>
      </group>
    </group>
  );
};

export default Avatar;
