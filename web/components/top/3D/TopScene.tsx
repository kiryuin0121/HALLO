"use client";

import { useFrame } from "@react-three/fiber";
import KiryuYokohata from "../../global/3D/KiryuYokohata";
import {
  Environment,
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Stars
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group} from "three";
import { useControls } from "leva";
import { FloatingTexts } from "@/components/signUp/3D/AvatarConfigScene";
import { StarField, ColoredStarField} from "./StarField";

const FLOAT_SPEED = 1;
const FLOAT_RANGE = 0.1;

const TopScene = ({ onLoaded }: { onLoaded: () => void }) => {
  const groupRef = useRef<Group>(null!);
  // 街の3dモデルをロードする。
  const { scene } = useGLTF("/models/city/city.glb") as any;

  // ローディング画面を解除する
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  // leva
  const { cityScale, cityPos, cityRot } = useControls("City", {
    cityScale: { value: 0.1, min: 0.01, max: 10 },
    cityPos: { value: [3.5, -3.4, -8.0] },
    cityRot: { value: [0.06, 1.0, 0] },
  });
  const { charScale, charPos, charRot } = useControls("KiryuYokohata (God)", {
    charScale: { value: 90, min: 1, max: 200 },
    charPos: { value: [0, -110, -45] },
    charRot: { value: [-0.3, 0, 0] },
  });

  // 街をアニメーションさせる。
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = cityPos[1] - Math.sin(t * FLOAT_SPEED) * FLOAT_RANGE;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, -1, 8]} fov={47} />
      <OrbitControls makeDefault enableZoom={false} enablePan={false} enableRotate={false} />

      {/* 星 */}
      <Stars radius={80} depth={60} count={5000} factor={3} saturation={0.4} fade speed={0.3} />

      {/* <StarField count={1500} spread={100} minSize={0.4} maxSize={1.8} twinkle />w */}
      <ColoredStarField count={400} />

      {/* 照明 */}
      <Environment preset="night" environmentIntensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
      <directionalLight position={[0, 20, -10]} intensity={1.2} color="#2244aa" />
      <directionalLight position={[1, 0.1, -5]} intensity={2.5} color="#00ff88" />
      <directionalLight position={[-1, 0.1, -5]} intensity={2.0} color="#4488ff" />
      <pointLight position={[cityPos[0], cityPos[1] + 2, cityPos[2]]} intensity={3} color="#00ffaa" distance={12} />
      <pointLight position={[0, -0.5, 1]} intensity={0.8} color="#00ff88" />
      <fog attach="fog" args={["#020811", 20, 80]} />

      {/* 町 */}
      <group ref={groupRef} scale={cityScale} position={cityPos} rotation={cityRot}>
        <primitive object={scene} />
      </group>

      {/* 僕 */}
      <KiryuYokohata behavior={{ type: "godPose" }} scale={charScale} position={charPos} rotation={charRot} />
   
      {/* 背景の3dテキスト */}
      <FloatingTexts />
    </>
  );
};

export default TopScene;