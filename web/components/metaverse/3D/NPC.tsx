"use client";

import KiryuYokohata from "../../global/3D/KiryuYokohata";
import { Laptop } from "../../global/3D/Laptop";


const NPC = () => {
  return (
    <>
      {/* プログラミング */}
      <group
        position={[145.27075154144663, 0, -0.08553112555539044]}
        rotation={[0, (Math.PI * 6) / 4, 0]}
      >
        <KiryuYokohata behavior={{ type: "programming" }} scale={5.5} />
        {/* LaptopのpositionはNPCのgroup座標系からの相対座標で調整する */}
        <Laptop position={[-1.5, 4.1, 1.3]} scale={2.8} />
      </group>

      {/* 腹筋 */}
      <group position={[124, 0, -70]} rotation={[0, (Math.PI * 9) / 4, 0]}>
        <KiryuYokohata
          behavior={{ type: "situp" }}
          scale={4.5}
          rotation={[0, Math.PI, 0]}
        />
        <KiryuYokohata
          behavior={{ type: "sitting" }}
          scale={4.5}
          position={[0, 0, -3.5]}
          rotation={[0, 0, 0]}
        />

        <mesh position={[0, 0.02, -1]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[4, 0.05, 9]} />
          <meshStandardMaterial color="#4a90d9" roughness={0.8} />
        </mesh>
      </group>

      {/* スクワット */}
      <group position={[73.5, 0, -58]} rotation={[0, Math.PI / 2, 0]}>
        <KiryuYokohata behavior={{ type: "squat" }} scale={3.7} />
      </group>

      {/* ネットサーフィン */}
      <group position={[91, 1.35, -44.5]} rotation={[0, Math.PI / 2, 0]}>
        <KiryuYokohata behavior={{ type: "lying" }} scale={3.8} />
        <Laptop
          position={[0.9, 0.2, 3]}
          scale={1.5}
          rotation={[0, Math.PI / 6, 0]}
        />
      </group>
    </>
  );
};

export default NPC;
