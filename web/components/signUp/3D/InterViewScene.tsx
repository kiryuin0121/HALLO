"use client";
import KiryuYokohata from "@/components//global/3D/KiryuYokohata";
import { Laptop } from "@/components//global/3D/Laptop";
import {
  Environment,
  Gltf,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  SpotLight,
  Stars,
  useGLTF,
} from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";
import KiryuYokohataAvatar from "./KiryYokohataAvatar";

import { SkeletonUtils } from "three-stdlib";

// ─── テクスチャ生成 ───────────────────────────────────────────────────────────

// 壁・天井用コンクリートテクスチャ。
// roughness だけでは出せない「ピクセル単位の明度ムラ」を作るために Canvas でノイズを加算する。
// noiseAmount を上げる → 明度ムラが広がり荒れた壁に見える（現在: 壁=20）
// streak の確率（0.997）を下げる → 型枠跡の縦筋が増える。上げると消える
// streak の振れ幅（40）を上げる → 縦筋が濃くなる
// RGB に係数差（×1 / ×0.95 / ×0.9）をつけているのは、ノイズが真っ白・真っ黒にならず
// わずかに黄みがかった色ムラになるようにするため（コンクリートらしさ）
const makeConcreteTexture = (
  baseColor: [number, number, number],
  noiseAmount: number,
  repeatX: number,
  repeatY: number,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const [r, g, b] = baseColor;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 512, 512);
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * noiseAmount;
    const streak = Math.random() > 0.997 ? (Math.random() - 0.5) * 40 : 0;
    d[i] = Math.min(255, Math.max(0, d[i] + noise + streak));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise * 0.95 + streak));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise * 0.9 + streak));
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
};

// 床用タイルテクスチャ（色ムラのみ）。
// 目地は <Grid> で上に重ねるためここでは描かない。
// noise ±8 を上げる → タイル表面の汚れ・経年感が強くなる
const makeTileTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f0eeeb";
  ctx.fillRect(0, 0, 512, 512);
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    d[i] = Math.min(255, Math.max(0, d[i] + noise));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(15, 10);
  return tex;
};

// ─── 構成コンポーネント ───────────────────────────────────────────────────────

// 窓1枚分のサッシ + ガラス + 窓台
// Wall の rotation-y={Math.PI/2} 内座標系: X=壁に沿う方向, Z=壁厚方向（室内側が+Z）
// posX: 壁に沿う方向のオフセット
const WindowUnit = ({ posX }: { posX: number }) => (
  <group position={[posX, 1.7, 2]}>
    {/* サッシ外枠 上・下・左・右 */}
    <mesh position={[0, 1.5, 0]}>
      <boxGeometry args={[5.08, 0.07, 0.18]} />
      <meshStandardMaterial color="#a8acb0" metalness={0.75} roughness={0.25} />
    </mesh>
    <mesh position={[0, -1.5, 0]}>
      <boxGeometry args={[5.08, 0.07, 0.18]} />
      <meshStandardMaterial color="#a8acb0" metalness={0.75} roughness={0.25} />
    </mesh>
    <mesh position={[-2.5, 0, 0]}>
      <boxGeometry args={[0.07, 3.07, 0.18]} />
      <meshStandardMaterial color="#a8acb0" metalness={0.75} roughness={0.25} />
    </mesh>
    <mesh position={[2.5, 0, 0]}>
      <boxGeometry args={[0.07, 3.07, 0.18]} />
      <meshStandardMaterial color="#a8acb0" metalness={0.75} roughness={0.25} />
    </mesh>
    {/* ガラス面 */}
    <mesh>
      <boxGeometry args={[4.92, 2.94, 0.02]} />
      <meshPhysicalMaterial
        color="#d0e8f5"
        transparent
        opacity={0.18}
        roughness={0.04}
        transmission={0.88}
        reflectivity={0.55}
        envMapIntensity={1.4}
      />
    </mesh>
    {/* 窓台（室内側 = Z+ 方向に出っ張る）*/}
    <mesh position={[0, -1.525, 0.15]}>
      <boxGeometry args={[5.14, 0.05, 0.16]} />
      <meshStandardMaterial color="#d4d2ce" roughness={0.55} metalness={0.1} />
    </mesh>
  </group>
);

const Wall = () => {
  const wallTex = useMemo(
    () => makeConcreteTexture([242, 240, 237], 20, 3, 1.5),
    [],
  );
  return (
    <group rotation-y={Math.PI / 2} position={[-5, 0, 0]}>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[20, 1.7, 1]} />
        <meshStandardMaterial
          map={wallTex}
          roughness={0.92}
          color="#edecea"
          envMapIntensity={0.2}
        />
      </mesh>
      {/* 窓: 元の2枚 + 手前・奥に追加した2列分 */}
      <group position={[2.5, 1.6, -2.4]}>
        <WindowUnit posX={-10} />
        <WindowUnit posX={-5} />
        <WindowUnit posX={0} />
        <WindowUnit posX={5} />
      </group>
      {/* シャッター: 窓に合わせて4枚分 */}
      <group position={[4, 1.4, -2.4]}>
        <Gltf
          src="/models/shutter/scene.gltf"
          scale={[0.039, 0.05, 0.039]}
          position-x={-14.9}
        />
        <Gltf
          src="/models/shutter/scene.gltf"
          scale={[0.039, 0.05, 0.039]}
          position-x={-9.9}
        />
        <Gltf
          src="/models/shutter/scene.gltf"
          scale={[0.039, 0.05, 0.039]}
          position-x={-4.9}
        />
        <Gltf src="/models/shutter/scene.gltf" scale={[0.039, 0.05, 0.039]} />
      </group>
    </group>
  );
};

const Floor = () => {
  const tileTex = useMemo(() => makeTileTexture(), []);
  return (
    <group position-x={2.5}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[15, 20]} />
        <meshStandardMaterial
          map={tileTex}
          roughness={0.3}
          metalness={0.05}
          color="#f4f2ef"
        />
      </mesh>
      {/* cellSize=1 → タイル1枚が1ユニット。cellColor を明るくすると目地が目立たなくなる */}
      <Grid
        position={[0, 0.01, 0]}
        args={[15, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#a8a29e"
        sectionSize={0}
        sectionThickness={0}
        infiniteGrid={false}
      />
    </group>
  );
};

// isSitting=false のとき Z+ 方向に引いて「空席」を表現
const Chair = ({ isSitting = false }) => {
  const { scene } = useGLTF("/models/chair/scene.gltf");
  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          color: "#1a1a1a",
          roughness: child.material?.roughness ?? 0.6,
          metalness: child.material?.metalness ?? 0,
        });
      }
    });
    return clone;
  }, [scene]);
  return (
    <primitive
      object={cloned}
      scale={0.05}
      position-y={-0.1}
      position-z={isSitting ? 0 : 0.5}
    />
  );
};

const Desk = () => {
  const { scene } = useGLTF("/models/desk/scene.gltf");

  const cloned = useMemo(() => {
    const c = SkeletonUtils.clone(scene);

    c.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        if ("envMapIntensity" in mat) {
          mat.envMapIntensity = 0.05;
        }
      }
    });

    return c;
  }, [scene]);

  return (
    <primitive
      object={cloned}
      position={[-0.3, 1.5, 1.2]}
      scale={0.7}
      rotation-y={Math.PI / 2}
    />
  );
};

// Three.js では target-position JSX props が機能しないため useEffect で手動設定する
// 光源: 窓壁（X=-5）の外側 → 照射先: 室内中央付近
const SunLight = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);
  const { scene } = useThree();
  useEffect(() => {
    scene.add(targetRef.current); // target はシーンに add しないと Three.js が認識しない
    lightRef.current.target = targetRef.current;
  }, [scene]);
  return (
    <>
      <object3D ref={targetRef} position={[2, 0.5, 0]} />
      <directionalLight
        ref={lightRef}
        position={[-7, 1.5, 0]}
        intensity={0.8}
        color="#fff8e0"
        castShadow
      />
    </>
  );
};

// 1行分の座席（左列 X=-2.2, 右列 X=0）
// isMain=true → KiryuYokohata が着席する特別席

const SeatRow = ({ isMain = false }: { isMain?: boolean }) => (
  <>
    <group position={[-2.2, 0, 0]}>
      {isMain ? (
        <>
          <KiryuYokohata scale={2} behavior={{ type: "programming" }} />
          <group position={[1.6, 1.3, 2]}>
            <KiryuYokohataAvatar />
          </group>
          <Chair isSitting={true} />
          <Desk />
          <Laptop scale={1} position={[-0.5, 1.5, 0.5]} />
        </>
      ) : (
        <>
          <Desk />
          <Chair />
        </>
      )}
    </group>
    <group position={[0, 0, 0]}>
      <Desk />
      <Chair />
    </group>
  </>
);

// ─── メインシーン ─────────────────────────────────────────────────────────────
const InterviewScene = () => {
  const { camera, controls } = useThree() as any;

  //   useEffect(() => {
  //     const log = () => {
  //       const p = camera.position;
  //       const r = camera.rotation;
  //       const f = camera.fov;
  //       const t = controls?.target;

  //       console.log(`
  // <PerspectiveCamera
  //   makeDefault
  //   position={[${p.x}, ${p.y}, ${p.z}]}
  //   rotation={[${r.x}, ${r.y}, ${r.z}]}
  //   fov={${f}}
  // />
  // `);

  //       if (t) {
  //         console.log(`// lookAt
  // camera.lookAt(${t.x}, ${t.y}, ${t.z});`);
  //       }
  //     };

  //     window.addEventListener("keydown", (e) => {
  //       if (e.key === "p") log();
  //     });

  //     return () => {
  //       window.removeEventListener("keydown", (e) => {
  //         if (e.key === "p") log();
  //       });
  //     };
  //   }, [camera, controls]);

  return (
    <>
      {/* <color args={["#171717"]} attach="background" /> */}
      <Environment preset="city" environmentIntensity={0.15} />
      {/* 星 */}
      <Stars
        radius={80}
        depth={60}
        count={5000}
        factor={3}
        saturation={0.4}
        fade
        speed={0.3}
      />
      <ambientLight intensity={0.5} color="#f0ece0" />
      <SunLight />

      <Floor />
      <Wall />
      {/* <OrbitControls makeDefault /> */}
      <PerspectiveCamera
        makeDefault
        position={[-1.1181109600105934, 2.6361617494378957, 6.749748028854846]}
        rotation={[
          -0.400406316066942, 0.005673124974681731, 0.002401258864185601,
        ]}
        fov={75}
        onUpdate={() =>
          camera.lookAt(
            -1.1608673651211285,
            -0.30154005365438,
            -0.19070653306063046,
          )
        }
      />
      {/* 座席グループ 1 */}
      <group position-x={-0.7}>
        {/* <group position-z={8.1}>
          <SeatRow />
        </group> */}
        <group position-z={5.4}>
          <SeatRow />
        </group>
        <group position-z={2.7}>
          <SeatRow isMain={true} />
        </group>
        <group position-z={0}>
          <SeatRow />
        </group>
        <group position-z={-2.7}>
          <SeatRow />
        </group>
        <group position-z={-5.4}>
          <SeatRow />
        </group>
        <group position-z={-8.1}>
          <SeatRow />
        </group>
      </group>

      {/* 座席グループ 2 */}
      <group position-x={6.2}>
        {/* <group position-z={8.1}>
          <SeatRow />
        </group> */}
        <group position-z={5.4}>
          <SeatRow />
        </group>
        <group position-z={2.7}>
          <SeatRow />
        </group>
        <group position-z={0}>
          <SeatRow />
        </group>
        <group position-z={-2.7}>
          <SeatRow />
        </group>
        <group position-z={-5.4}>
          <SeatRow />
        </group>
        <group position-z={-8.1}>
          <SeatRow />
        </group>
      </group>
    </>
  );
};

export default InterviewScene;
