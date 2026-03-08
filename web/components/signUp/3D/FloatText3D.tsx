"use client";
import { Center, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { MeshStandardMaterial } from "three";
import { Mesh } from "three";
type Props = {
  text: string;
  position: [number, number, number];
  speed: number;
  phase: number;
  baseOpacity: number;
  color: string;
  size: number; // 3Dテキストのサイズ
  rotation?: [number, number, number];
};

const FloatText3D = ({
  text,
  position,
  speed,
  phase,
  baseOpacity,
  color,
  size,
  rotation = [0, 0, 0],
}: Props) => {
  const ref = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.4;
    // ゆっくり回転してインタラクティブ感を出す
    ref.current.rotation.y =
      rotation[1] + Math.sin(t * speed * 0.3 + phase) * 0.15;
    // 透明度アニメーション
    (ref.current.material as MeshStandardMaterial).opacity =
      baseOpacity * (0.4 + Math.abs(Math.sin(t * speed * 0.4 + phase)) * 0.6);
  });

  return (
    <Center position={position}>
      <Text3D
        ref={ref}
        font="/fonts/DotGothic16_Regular.json"
        size={size}
        height={0.05} // 押し出し深さ。大きくすると立体感が増す
        curveSegments={4}
        bevelEnabled={false}
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4} // 自発光の強さ。大きくするとグロー感が増す
          transparent
          opacity={baseOpacity}
          depthWrite={false}
        />
      </Text3D>
    </Center>
  );
};

export default FloatText3D;
