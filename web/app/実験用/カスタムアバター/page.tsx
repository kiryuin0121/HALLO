"use client";
import { initAvatarStateAtom } from "@/atoms/avatar";
import { Suspense, useEffect } from "react";
import Experience from "./Experience";
import UI from "./UI";
import { Canvas } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { Html } from "@react-three/drei";

const Loading = () => {
  return (
    <Html center fullscreen>
      <div className={`font-mplus font-bold text-neutral-100 tracking-wide text-3xl`}>
        アバターを設定する準備をしています・・・
      </div>
    </Html>
  );
};
const AvatarConfigDemo = () => {
  const initAvatarState = useSetAtom(initAvatarStateAtom);
  
  useEffect(() => {
    initAvatarState();
  }, [initAvatarState]);

  return (
    <div className={`w-screen h-screen`}>
      <UI />
      <Canvas
        camera={{
          position: [-1, 1, 5],
          fov: 45,
        }}
        shadows
      >
        <color attach={"background"} args={["#555"]} />
        <fog attach={"fog"} args={["#555", 15, 25]} />
        <Suspense fallback={<Loading />}>
          <group position-y={-0.8}>
            <Experience />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AvatarConfigDemo;
