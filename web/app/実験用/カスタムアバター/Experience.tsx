"use client";
import Avatar from "./Avatar";
import {
  Backdrop,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
} from "@react-three/drei";

const Experience = () => {
  return (
    <>
     
      <OrbitControls
        // 上下方向回転
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        // 左右方向の回転
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        //
        enableZoom={false}
        enablePan={false}
      />
      {/* -----照明----- */}
      {/* keylight */}
      <Environment preset="sunset" environmentIntensity={0.3} />
      <Backdrop scale={[50, 10, 5]} floor={1.5} receiveShadow position-z={-4}>
        <meshStandardMaterial color={"#555"} />
      </Backdrop>
      <SoftShadows size={52} samples={16} />
      {/* filllight */}
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

      {/* -----3dオブジェクト----- */}
      <Avatar />
    </>
  );
};

export default Experience;
