import { signUpAtom } from "@/atoms/signUp";
import { PartsCategory } from "@/generated/prisma/enums";
import { AvatarConfigValue } from "@/types/avatar";
import { useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { Key, useMemo } from "react";
import { MeshStandardMaterial, Skeleton } from "three";
import { SkeletonUtils } from "three-stdlib";
type Props = {
  categoryName: PartsCategory;
  model: string;
  avatarSkeleton: Skeleton;
};
const Parts = ({ model, categoryName, avatarSkeleton }: Props) => {
  // パーツのsceneを取得する。
  const { scene } = useGLTF(model);

  // パーツの詳細情報(色）が欲しいので、avatarConfigを取得する。
  const signUp = useAtomValue(signUpAtom);
  const avatarConfig = JSON.parse(signUp.avatarConfig);


  // 着用中のパーツ
  const attachedItems = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(scene);
    const items: any[] = [];
    const partsColor = avatarConfig[categoryName]?.color;

    clonedScene.traverse((child: any) => {
      if (child.isSkinnedMesh) {
        // partsの骨格をavatar本体の骨格に対応付ける。
        child.skeleton = avatarSkeleton;

        // 皮膚(体全体)に顔の色(head)を適応させる。
        if (child.material.name.includes("Skin_")) {
          child.material = child.material.clone();
          child.material.color.set(avatarConfig.head.color);
        }
        // partsにpartsColorを適応させる。
        else if (child.material.name.includes("Color_") && partsColor) {
          child.material = child.material.clone();
          child.material.color.set(partsColor);
        }

        items.push(child);
      }
    });

    return items;
  }, [scene, avatarSkeleton, avatarConfig, categoryName]);

  return attachedItems.map((mesh, idx) => (
    <primitive object={mesh} key={idx} castShadow receiveShadow />
  ));
};

export default Parts;
