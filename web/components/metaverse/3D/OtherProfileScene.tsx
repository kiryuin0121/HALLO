import { AvatarConfig } from "@/types/avatar";
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ProfileAvatar from "./ProfileAvatar";
import { FloatingTexts } from "@/components/signUp/3D/AvatarConfigScene";

type Props = {
  avatarConfig: AvatarConfig;
};

const OtherProfileScene = ({ avatarConfig }: Props) => {
  return (
    <Canvas
      camera={{
        position: [0.5, 1.2, 4], // MyProfileScene の PROFILE_CAMERA_POSITION と同じ
        fov: 45,
      }}
      shadows
    >
      <color attach={"background"} args={["#0d1117"]} />
      <fog attach={"fog"} args={["#0d1117", 15, 38]} />

      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        enableZoom={false}
        enablePan={false}
      />

      {/* MyProfileScene の PROFILE_GROUP_X / PROFILE_GROUP_Y と同じ */}
      <group position={[0.9, -1.2, 0]}>
        <Environment preset="sunset" environmentIntensity={0.5} />
        <SoftShadows size={52} samples={16} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          color={"#ffffff"}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[1, 0.1, -5]}  intensity={2} color={"#00ff88"} />
        <directionalLight position={[-1, 0.1, -5]} intensity={2} color={"#4488ff"} />
        <pointLight position={[0, -0.5, 1]} intensity={0.8} color={"#00ff88"} />

        <Grid
          position={[0, 0, 0]}
          args={[40, 40]}
          cellSize={0.5}
          cellThickness={0.3}
          cellColor={"#1e3a2f"}
          sectionSize={2}
          sectionThickness={0.8}
          sectionColor={"#00ff88"}
          fadeDistance={18}
          fadeStrength={2}
          infiniteGrid
        />

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.6}
          scale={5}
          blur={2}
          far={2}
          color={"#001a0a"}
        />
        <FloatingTexts />
        <ProfileAvatar avatarConfig={avatarConfig} />
      </group>
    </Canvas>
  );
};

export default OtherProfileScene;