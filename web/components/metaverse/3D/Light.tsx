"use client";

import { useHelper } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { DirectionalLight, DirectionalLightHelper } from "three";

const Light = () => {
  const lightRef = useRef<DirectionalLight>(null!);
  const { scene } = useThree();

  // Levaでライトを制御
  const { x, y, z, intensity, showHelper } = useControls("DirectionalLight", {
    x: { value: 500, min: -1000, max: 1000, step: 1 },
    y: { value: 500, min: -1000, max: 1000, step: 1 },
    z: { value: 500, min: -1000, max: 1000, step: 1 },
    intensity: { value: 0.1, min: 0, max: 10, step: 0.1 },
    showHelper: true,
  });

  // DirectionalLightHelperを表示
  useHelper(showHelper && lightRef, DirectionalLightHelper, 10);

  useEffect(() => {
    if (!lightRef.current) return;
    lightRef.current.target.position.set(
      102.04078364086386,
      3,
      -49.19205738238992,
    );
    scene.add(lightRef.current.target);
  }, [scene]);
  return (
    <directionalLight
      position={[x, y, z]}
      intensity={intensity}
      castShadow
      shadow-autoUpdate={false}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.1}
      shadow-camera-far={100}
      shadow-camera-left={-500}
      shadow-camera-right={500}
      shadow-camera-top={500}
      shadow-camera-bottom={-500}
      shadow-bias={-0.001}
    >
      <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
    </directionalLight>
  );
};

export default Light;
