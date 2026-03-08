import { Backdrop, Environment, SoftShadows } from "@react-three/drei";
import React from "react";
import Avatar from "./Avatar";

const Scene = () => {
  return (
    <>
      <Environment preset="sunset" environmentIntensity={0.5} />
      <SoftShadows size={52} samples={16} />
      <Backdrop scale={[50, 10, 5]} floor={1.5} receiveShadow position-z={-4}>
        <meshStandardMaterial color={"#555"} />
      </Backdrop>
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      {/* backlight */}
      <directionalLight
        position={[1, 0.1, -5]}
        intensity={3}
        color={"lightpink"}
      />
      <directionalLight
        position={[-1, 0.1, -5]}
        intensity={5}
        color={"lightblue"}
      />

      {/* 3dobject */}
      <Avatar/>
    </>
  );
};

export default Scene;
