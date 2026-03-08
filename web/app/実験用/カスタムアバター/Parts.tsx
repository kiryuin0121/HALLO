"use client";
import { avatarConfigAtom, skinMaterialAtom } from "@/atoms/avatar";
import { PartsCategory } from "@/generated/prisma/enums";
import { useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import React, { useEffect, useMemo } from "react";
import { Material } from "three";
import { Skeleton } from "three";
import { SkeletonUtils } from "three-stdlib";

type Props = {
  model: string; //パーツの3dモデルへのパス
  categoryName: PartsCategory; //パーツの種類(頭、髪の毛、顔,...)
  avatarSkeleton: Skeleton; //アバター(親)の骨格
};

const Parts = ({ model, categoryName, avatarSkeleton }: Props) => {
  const { scene } = useGLTF(model);
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const skinMaterial = useAtomValue(skinMaterialAtom);

  // 身に着けているパーツ
  const attachedItems = useMemo(() => {
    
    const clonedScene = SkeletonUtils.clone(scene);
    const items: any[] = [];
    const partsColor = avatarConfig[categoryName]?.color;

    clonedScene.traverse((child: any) => {
      if (child.isSkinnedMesh) {
        // 1. 骨の付け替え
        child.skeleton = avatarSkeleton;

        // 2. 皮膚の差し替え
        if (child.material.name.includes("Skin_")) {
          child.material = skinMaterial;
        }
        // 3. パーツの色変更 (クローンに対して行う)
        else if (child.material.name.includes("Color_") && partsColor) {
          // マテリアルもクローンしないと、他のパーツと共有されてしまう場合がある
          child.material = child.material.clone();
          child.material.color.set(partsColor);
        }

        items.push(child);
      }
    });

    return items;
  }, [scene, avatarSkeleton, skinMaterial, avatarConfig, categoryName]);


  return attachedItems.map((mesh, idx) => (
    <primitive object={mesh} key={idx} castShadow receiveShadow />
  ));
};

export default Parts;

// const attachedItems = useMemo(() => {
//   const items: AttachedItem[] = [];
//   scene.traverse((child: any) => {
//     if (child.isMesh) {
//       items.push({
//         geometry: child.geometry,
//         material: child.material.name.includes("Skin_")
//           ? skinMaterial
//           : child.material,
//       });
//     }
//   });
//   return items;
// }, [scene]);

// return attachedItems.map((item, idx) => {
//   return (
//     <skinnedMesh
//       key={idx}
//       skeleton={skeleton}
//       geometry={item.geometry}
//       material={item.material}
//       castShadow
//       receiveShadow
//     />
//   );
// });
