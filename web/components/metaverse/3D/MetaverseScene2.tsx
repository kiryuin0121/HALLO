"use client";

import { useRef,useMemo } from "react";
import { Environment, useGLTF } from "@react-three/drei";
import { Group } from "three";

const MetaverseScene = () => {
  const { scene } = useGLTF("/models/city/city.glb") as any;
  const groupRef = useRef<Group>(null);

  const metaverseScene = useMemo(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return scene;
  }, [scene]);
  return (
    <group ref={groupRef} scale={2.2}>
      <primitive object={metaverseScene} />
      <Environment preset="city" environmentIntensity={0.7} />
    </group>
  );
};

export default MetaverseScene;
