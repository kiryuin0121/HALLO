// Laptop.tsx
"use client";
import { useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, MeshBasicMaterial, Color } from "three";

interface LaptopNodes {
  Object_4: Mesh;
  Object_5: Mesh;
  Object_6: Mesh;
  Object_7: Mesh;
  Object_8: Mesh;
  Object_10: Mesh;
  Object_11: Mesh;
  Object_12: Mesh;
  Object_14: Mesh;
}

interface LaptopMaterials {
  "case": MeshStandardMaterial;
  touchpad: MeshStandardMaterial;
  ports: MeshStandardMaterial;
  holes: MeshStandardMaterial;
  ethernet_port: MeshStandardMaterial;
  display: MeshStandardMaterial;
  bezel: MeshStandardMaterial;
  keyboard: MeshStandardMaterial;
}

interface LaptopProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const glowMaterial = new MeshBasicMaterial({
  color: new Color(0.2, 0.5, 1.0), // 青白い光
  toneMapped: false,
});

export const Laptop = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: LaptopProps) => {
  const { nodes, materials } = useGLTF("/models/laptop.glb") as unknown as {
    nodes: LaptopNodes;
    materials: LaptopMaterials;
  };

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <group position={[0.501, 0.021, 0.454]} rotation={[-Math.PI, 0, -Math.PI]} scale={0.115}>
        <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials["case"]} />
        <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials.touchpad} />
        <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials.ports} />
        <mesh castShadow receiveShadow geometry={nodes.Object_7.geometry} material={materials.holes} />
        <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials.ethernet_port} />
      </group>
      <group
        position={[0.501, 0.028, 0.742]}
        rotation={[-1.309, 0, -Math.PI]}
        scale={[0.115, 0.055, 0.115]}
      >
        <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials["case"]} />
        <mesh geometry={nodes.Object_11.geometry} material={glowMaterial} />
        <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials.bezel} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_14.geometry}
        material={materials.keyboard}
        position={[0.515, 0.037, 0.541]}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={0.115}
      />
    </group>
  );
};

useGLTF.preload("/models/laptop.glb");