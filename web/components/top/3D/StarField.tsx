"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---- 星フィールド（Points） ----
export const StarField = ({
  count = 3000,
  spread = 120,
  minSize = 0.5,
  maxSize = 2.0,
  color = "#ffffff",
  twinkle = true,
}: {
  count?: number;
  spread?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
  twinkle?: boolean;
}) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 球状に分布させる
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (Math.random() ** 0.5) * spread; // 内側に集中させる

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4; // 縦を潰して銀河盤状
      positions[i * 3 + 2] = r * Math.cos(phi) - 20; // 少し奥に押す

      sizes[i] = minSize + Math.random() * (maxSize - minSize);
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, phases };
  }, [count, spread, minSize, maxSize]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [positions, sizes, phases]);

  // きらめきアニメーション
  useFrame((state) => {
    if (!twinkle || !pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const sizeAttr = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute;
    const phaseAttr = pointsRef.current.geometry.attributes.phase as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const base = sizes[i];
      const p = phaseAttr.getX(i);
      sizeAttr.setX(i, base * (0.6 + 0.4 * Math.sin(t * 1.5 + p)));
    }
    sizeAttr.needsUpdate = true;

    // ゆっくり自転
    pointsRef.current.rotation.y += 0.00015;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={color}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
      />
    </points>
  );
};

// ---- カラー星（RGB混在） ----
export const ColoredStarField = ({ count = 800 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // 星の色パレット（宇宙っぽい）
    const palette = [
      [0.6, 0.8, 1.0],  // 青白
      [1.0, 0.9, 0.7],  // 黄白
      [1.0, 0.5, 0.3],  // 赤橙
      [0.5, 1.0, 0.8],  // シアン
      [0.3, 0.6, 1.0],  // 青
      [1.0, 0.3, 0.5],  // ピンク
    ];

    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      positions[i * 3 + 2] = r * Math.cos(phi) - 20;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, colors };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame(() => {
    if (pointsRef.current) pointsRef.current.rotation.y += 0.00008;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ---- 流れ星（Shooting Stars） ----
export const ShootingStar = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const dataRef = useRef({ progress: Math.random(), speed: 0.003 + Math.random() * 0.004 });

  const startPos = useMemo(() => new THREE.Vector3(
    -30 + Math.random() * 20,
    10 + Math.random() * 10,
    -30 + Math.random() * 10
  ), []);

  const endPos = useMemo(() => new THREE.Vector3(
    startPos.x + 15 + Math.random() * 10,
    startPos.y - 8 - Math.random() * 6,
    startPos.z + 5
  ), [startPos]);

  useFrame(() => {
    if (!meshRef.current) return;
    dataRef.current.progress += dataRef.current.speed;
    if (dataRef.current.progress > 1.3) {
      dataRef.current.progress = 0;
      dataRef.current.speed = 0.003 + Math.random() * 0.004;
    }
    const t = Math.min(dataRef.current.progress, 1);
    meshRef.current.position.lerpVectors(startPos, endPos, t);
    (meshRef.current.material as THREE.Material).opacity = t < 0.1 ? t * 10 : t > 0.8 ? (1 - t) * 5 : 1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
};
