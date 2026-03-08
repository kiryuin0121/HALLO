// 
"use client";

import { avatarConfigAtom, editStateAtom } from "@/atoms/myProfile";
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  SoftShadows,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { Group, Vector3 } from "three";
import ProfileAvatar from "./ProfileAvatar";
import { FloatingTexts } from "@/components/signUp/3D/AvatarConfigScene";

// --------------------------------------------------------
// プロフィール表示時: アバターを右寄りに配置するためカメラもX正方向にシフト
// アバター編集時: 元コードと全く同じ位置・挙動を維持
// --------------------------------------------------------

const PROFILE_CAMERA_POSITION  = new Vector3(0.5, 1.2, 4);   // 右寄り上半身
const AVATAR_EDIT_CAMERA_POSITION = new Vector3(-1, 1, 5.5);   

const PROFILE_GROUP_Y    = -1.2;  
const AVATAR_EDIT_GROUP_Y = -0.8; 

// プロフィール時は右寄り、アバター編集時は元コードと同じ中央寄り
const PROFILE_GROUP_X    = 0.9;
const AVATAR_EDIT_GROUP_X = -0.2; 

const LERP_SPEED = 0.1;

const CameraAnimator = ({ isAvatarEditing }: { isAvatarEditing: boolean }) => {
  const { camera } = useThree();
  useFrame(() => {
    const target = isAvatarEditing
      ? AVATAR_EDIT_CAMERA_POSITION
      : PROFILE_CAMERA_POSITION;
    camera.position.lerp(target, LERP_SPEED);
  });
  return null;
};

type SceneGroupProps = {
  isAvatarEditing: boolean;
  avatarConfig: ReturnType<typeof useAtomValue<typeof avatarConfigAtom>>;
};

const SceneGroup = ({ isAvatarEditing, avatarConfig }: SceneGroupProps) => {
  const groupRef = useRef<Group>(null!);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = isAvatarEditing ? AVATAR_EDIT_GROUP_Y : PROFILE_GROUP_Y;
    const targetX = isAvatarEditing ? AVATAR_EDIT_GROUP_X : PROFILE_GROUP_X;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * LERP_SPEED;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * LERP_SPEED;
  });

  return (
    <group ref={groupRef} position={[PROFILE_GROUP_X, PROFILE_GROUP_Y, 0]}>
      <Environment preset="sunset" environmentIntensity={isAvatarEditing ? 0.4 : 0.5} />
      <SoftShadows size={52} samples={16} />

      <directionalLight position={[5, 5, 5]} intensity={2} color={"#ffffff"}
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0001} />
      <directionalLight position={[1, 0.1, -5]}  intensity={2} color={"#00ff88"} />
      <directionalLight position={[-1, 0.1, -5]} intensity={2} color={"#4488ff"} />
      <pointLight position={[0, -0.5, 1]} intensity={0.8} color={"#00ff88"} />

      <Grid position={[0, 0, 0]} args={[40, 40]}
        cellSize={0.5} cellThickness={0.3} cellColor={"#1e3a2f"}
        sectionSize={2} sectionThickness={0.8} sectionColor={"#00ff88"}
        fadeDistance={18} fadeStrength={2} infiniteGrid />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.6} scale={5} blur={2} far={2} color={"#001a0a"} />
      <FloatingTexts />
      <ProfileAvatar avatarConfig={avatarConfig} />
    </group>
  );
};

const MyProfileScene = () => {
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const editState    = useAtomValue(editStateAtom);
  const isAvatarEditing = editState === "avatar";

  return (
    <Canvas camera={{ position: PROFILE_CAMERA_POSITION.toArray(), fov: 45 }} shadows>
      <color attach={"background"} args={["#0d1117"]} />
      <fog attach={"fog"} args={["#0d1117", 15, 38]} />

      <CameraAnimator isAvatarEditing={isAvatarEditing} />

      <OrbitControls
        minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4} maxAzimuthAngle={Math.PI / 4}
        enableZoom={false} enablePan={false}
      />

      <SceneGroup isAvatarEditing={isAvatarEditing} avatarConfig={avatarConfig} />
    </Canvas>
  );
};

export default MyProfileScene;