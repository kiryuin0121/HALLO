"use client";
import { PartsCategory } from "@/generated/prisma/enums";
import { useAnimations,useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef} from "react";
import { AnimationAction, Group, Skeleton } from "three";
import { SkeletonUtils } from "three-stdlib";
import Parts from "../../metaverse/3D/Parts";

const date = new Date("2026-01-26T14:50:19.136Z");
const AVATAR_CONFIG = {
  head: {
    parts: {
      id: "52341647-7dd7-4e36-b9b2-a70c88763f33",
      name: "head01",
      image: "/models/parts/head01.png",
      model: "/models/parts/Head.001.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "356cb675-c39c-44b4-8ad9-db0571bfa10c",
    },
    color: "#FFDFC4",
  },
  hair: {
    parts: {
      id: "4f25cb10-3d6a-4564-9a86-0bfee204845a",
      name: "hair04",
      image: "/models/parts/hair04.png",
      model: "/models/parts/Hair.004.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "fc720cf8-f9bc-4b2c-93da-db8afd2360b4",
    },
    color: "#262626",
  },
  face: { parts: null, color: null },
  eyes: {
    parts: {
      id: "cf546987-5caa-4c6b-bdfd-0436778175a4",
      name: "eyes10",
      image: "/models/parts/eyes10.png",
      model: "/models/parts/Eyes.010.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "d4f5da3a-b957-4012-a5ba-5915679762a7",
    },
    color: null,
  },
  eyebrows: {
    parts: {
      id: "5bc06297-11fa-4931-bfb0-e061a9c252c2",
      name: "eyebrows08",
      image: "/models/parts/eyebrows08.png",
      model: "/models/parts/Eyebrow.008.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "unknown",
    },
    color: "#330033",
  },
  nose: {
    parts: {
      id: "b792c913-89f3-44e0-88b0-966b2079a1cc",
      name: "nose04",
      image: "/models/parts/nose04.png",
      model: "/models/parts/Nose.004.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "44d3a79f-7568-4cbd-876f-86e8474c73fe",
    },
    color: null,
  },
  facial_hair: { parts: null, color: null },
  glasses: { parts: null, color: null },
  hat: { parts: null, color: null },
  top: {
    parts: {
      id: "e03346be-2a0d-4e87-8d00-1a7cb23ed8ed",
      name: "top02",
      image: "/models/parts/top02.png",
      model: "/models/parts/Top.002.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "62d003b7-1174-4caa-8e3a-8b6718173956",
    },
    color: "#001A3D",
  },
  bottom: {
    parts: {
      id: "78c60bc1-5314-47d8-8537-b8d215bd7fc9",
      name: "bottom01",
      image: "/models/parts/bottom01.png",
      model: "/models/parts/Bottom.001.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "31373f53-4ee0-4b0a-8c66-55a3c6c8ced6",
    },
    color: "#262626",
  },
  shoes: {
    parts: {
      id: "df62f753-d0b0-4217-9d3c-2a4de4990951",
      name: "shoes03",
      image: "/models/parts/shoes03.png",
      model: "/models/parts/Shoes.003.glb",
      createdAt: date,
      updatedAt: date,
      categoryId: "8901497e-290c-4efe-af68-6a40e89b4fa0",
    },
    color: "#262626",
  },
  accessories: { parts: null, color: null },
};
const KiryuYokohataAvatar = () => {
  const avatarRef = useRef<Group>(null!);
  const { scene } = useGLTF("/models/Armature.glb");

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const nodes = useMemo(() => {
    const nodeMap: any = {};
    clonedScene.traverse((child) => {
      if (child.name) nodeMap[child.name] = child;
    });
    return nodeMap;
  }, [clonedScene]);

  const { animations: idleAnimations } = useGLTF("/models/SittingIdle.glb");

  const avatarAnimations = useMemo(() => {
    const idle = idleAnimations.map((a) => a.clone());
    idle[0].name = "SittingIdle";

    return [...idle];
  }, [idleAnimations]);

  const { actions } = useAnimations(avatarAnimations, avatarRef);
  const actionRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    if(!actions["SittingIdle"])return;

    actions["SittingIdle"].timeScale = 0.2;
    actions["SittingIdle"].play();
    actionRef.current = actions["SittingIdle"];

    return () => {
      actions["SittingIdle"]?.stop();
      actionRef.current = null;
    };
  }, [actions]);

  return (
    <group ref={avatarRef} dispose={null}>
      <group position={[0, 0, 0]} scale={0.65}>
        <group name="Scene">
          <group name="Armature" scale={0.01} rotation-x={Math.PI / 2}>
            <primitive object={nodes.mixamorigHips} />

            {(Object.keys(AVATAR_CONFIG) as PartsCategory[]).map(
              (categoryName) => {
                const avatarConfigValue = AVATAR_CONFIG[categoryName];
                const parts = avatarConfigValue?.parts;
                const isRender = !!(parts && parts.model);
                return isRender ? (
                  <Suspense key={parts.id}>
                    <Parts
                      avatarConfig={AVATAR_CONFIG}
                      categoryName={categoryName}
                      model={parts.model}
                      avatarSkeleton={(nodes.Plane as any).skeleton as Skeleton}
                    />
                  </Suspense>
                ) : null;
              },
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
export default KiryuYokohataAvatar;