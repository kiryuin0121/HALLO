"use client";

import { Center, Text3D } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const HALLO = () => {
  return (
    <Center position={[102.04, 7, -47.19]}>
      {/* 立体テキスト */}
      <Text3D
        font="/fonts/Roboto_Bold.json"
        size={3}
        bevelEnabled
        bevelThickness={0.3}
        bevelSize={0.05}
        bevelSegments={10}
        letterSpacing={0.1}
      >
        HALLO
        <meshStandardMaterial
          color={0xffffff} 
          emissive={0xffffff}
          emissiveIntensity={0.35} 
          side={THREE.DoubleSide} 
        />
      </Text3D>
    </Center>
  );
};

export default HALLO;
