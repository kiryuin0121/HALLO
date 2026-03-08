"use client";
import { useGLTF } from "@react-three/drei";
useGLTF.preload("/models/city/city.glb");
useGLTF.preload("/models/KiryuYokohata.glb");
useGLTF.preload("/models/Armature.glb");
useGLTF.preload("/models/Idle.glb");
useGLTF.preload("/models/Walking.glb");

const ModelPreLoader = () => {
  return null;
};

export default ModelPreLoader;