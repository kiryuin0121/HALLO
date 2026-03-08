"use client";
import { Suspense } from "react";
import UI from "./UI";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

const Step5 = () => {
  return (
    <div className={`w-screen h-screen`}>
      <UI />
      <Canvas
        camera={{
          position: [-0.35, 1, 5],
          fov: 45,
        }}
        shadows
      >
        <color attach={"background"} args={["#555"]} />
        <fog attach={"fog"} args={["#555", 15, 25]} />
        <group position={[-0.35,-1,2.5]} >
          <Scene />
        </group>
      </Canvas>
    </div>
  );
};

export default Step5;
