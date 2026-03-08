"use client";
import { Canvas } from "@react-three/fiber";
import Players from "./Players";
import { Suspense } from "react";
import { Leva } from "leva";
import MetaverseScene from "./MetaverseScene2";
import NPC from "./NPC";
import HALLO from "./HALLO";
import Light from "./Light";
import GuideBoard from "./GuideBoard";
import { Stars } from "@react-three/drei";
const Metaverse = () => {
  return (
    <>
      <Leva hidden />
      <Canvas
        shadows
        camera={{
          fov: 60,
          position: [102.04078364086386, 3, -49.19205738238992],
          near: 0.01,
          far: 1000,
        }}
      >
        {/* メタバースに入室している人々 */}
        <Suspense fallback={null}>
          <Players />
        </Suspense>

        {/* NPC */}
        <NPC />

        {/* <color attach="background" args={["#9370db"]} /> */}
        <Stars
          radius={80}
          depth={60}
          count={5000}
          factor={3}
          saturation={0.4}
          fade
          speed={0.3}
        />

        <Light />

        <MetaverseScene />

        {/* HALLOロゴ */}
        <HALLO />

        {/*  掲示板*/}
        <GuideBoard />
        {/* <NoticeBoard/> */}
      </Canvas>
    </>
  );
};

export default Metaverse;
