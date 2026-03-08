"use client";
import { PartsCategory } from "@/generated/prisma/enums";
import { AvatarConfig } from "@/types/avatar";
import { useGLTF } from "@react-three/drei";
import React, { useMemo } from "react";
import { Skeleton } from "three";
import { SkeletonUtils } from "three-stdlib";

type Props = {
  avatarConfig: AvatarConfig;
  model: string; //パーツの3dモデルへのパス
  categoryName: PartsCategory; //パーツの種類(頭、髪の毛、顔,...)
  avatarSkeleton: Skeleton; //アバター(親)の骨格
};

const Parts = ({ avatarConfig, model, categoryName, avatarSkeleton }: Props) => {
  const { scene } = useGLTF(model);

  // 身に着けているパーツ
  const attachedItems = useMemo(() => {
    // パーツの3dモデルデータを複製する。(ほかの場所でもロードするので、互いに干渉するのを防止する)
    const clonedScene = SkeletonUtils.clone(scene);
    const items: any[] = [];
    const partsColor = avatarConfig[categoryName]?.color; //何色のパーツを装備しているか
    const skinColor = avatarConfig["head"]?.color ?? "#FFDFC4"; //肌の色はheadのcolorと同期させる

    clonedScene.traverse((child: any) => {
      if (child.isSkinnedMesh) {
        // 1. パーツをアバターの骨格と紐づける。
        child.skeleton = avatarSkeleton;

        // 2. 皮膚の色を適用する。
        if (child.material.name.includes("Skin_")) {
          // マテリアルをクローンして独立させる(他のアバターと共有されるのを防止する)
          child.material = child.material.clone();
          child.material.color.set(skinColor);
        }
        // 3. その他のパーツの色を適用する。(髪、服...)
        else if (child.material.name.includes("Color_") && partsColor) {
          // マテリアルをクローンして独立させる(他のパーツと共有されるのを防止する)
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