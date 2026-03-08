// KiryuYokohata.tsx
"use client";
import { useRef, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Color, Group, LoopPingPong, SRGBColorSpace } from "three";
import { SkeletonUtils } from "three-stdlib";

export type Behavior =
  | { type: "programming" }
  | { type: "lying" }
  | { type: "squat" }
  | { type: "situp" }
  | { type: "sitting" }
  | { type: "idle" }
  | { type: "godPose" }
  | {type:"sittingIdle"}
;

type Props = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  behavior: Behavior;
};

const KiryuYokohata = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 4,
  behavior,
}: Props) => {
  const group = useRef<Group>(null!);

  const { scene, animations } = useGLTF("/models/KiryuYokohata.glb") as any;

  // 複数体配置時にskeletonが干渉しないよう完全独立したインスタンスを生成
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // 複数体配置時にAnimationClipの再生状態が干渉しないようclone
  const clonedAnimations = useMemo(
    () => animations.map((anim: any) => anim.clone()),
    [animations],
  );

  // useAnimationsはgroupのrefスコープでMixerを生成するため各インスタンスが独立
  const { actions } = useAnimations(clonedAnimations, group);
useEffect(() => {
  clonedScene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const mat = child.material;

      // ① 色空間補正（重要）
      if (mat.map) {
        mat.map.colorSpace = SRGBColorSpace;
      }

      // ② 反射を適正化
      mat.roughness = Math.min(mat.roughness ?? 0.8, 0.6);
      mat.metalness = Math.min(mat.metalness ?? 0.2, 0.2);

      // ③ 明度を少しだけ持ち上げる
      // mat.color.multiplyScalar(1.05);
    }
  });
}, [clonedScene]);

  useEffect(() => {
    // 前の状態が残らないよう全停止してからbehaviorに応じて再生
    Object.values(actions).forEach((a: any) => a?.stop());

    switch (behavior.type) {
      case "programming":
        actions["Programming"]?.reset().play();
        break;
      case "lying":
        actions["Lying"]?.reset().play();
        break;
      case "squat":
        actions["Squat"]?.reset().play();
        break;
      case "situp":
        actions["SitUp"]?.reset().play();
        break;
      case "sitting":
        actions["Sitting"]?.reset().play();
        break;
      case "idle":
        actions["Idle"]?.reset().play();
        break;
      case "sittingIdle":
        actions["SittingIdle"]?.reset().play();
        break;
      case "godPose":
        const action = actions["GodPose"];
        if (action) {
          action.reset();
          action.timeScale = 0.3; // 再生速度を落とす（1.0が通常速度）
          action.setLoop(LoopPingPong, Infinity); // 往復再生
          action.play();
        }
        break;
    }
  }, [actions, behavior.type]);

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      dispose={null}
    >
      <primitive object={clonedScene} />
    </group>
  );
};
export default KiryuYokohata;


