"use client";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
  ContactShadows,
  Grid,
  Text,
  Text3D,
  Center,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import Avatar from "./Avatar";
import { useRef, useMemo } from "react";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import FloatText3D from "./FloatText3D";
import FloatText from "./FloatText";

const WORDS = [
  // コマンド系
  "npm install you",
  "git commit -m 'be yourself'",
  "sudo make me a sandwich",
  "echo 'hallo, world'",
  "> initializing avatar...",
  "[ OK ] loaded avatar.glb",
  // TypeScript / React 系
  "const avatar = new Avatar();",
  "import { soul } from './you';",
  "return <You />;",
  "type Me = { name: string }",
  "useState<Avatar>(null)",
  "useEffect(() => { live() }, [])",
  // Linux 系
  "chmod 777 yourself",
  "ps aux | grep happiness",
  "cat /dev/urandom | life",
  // その他
  "while(true) { dream(); }",
  "fn main() { be_yourself(); }",
];

const WORDS_3D = [
  "Next.js",
  "TypeScript",
  "R3F/Drei",
  "Prisma",
  "WebSocket",
  "React",
  "Express",
  "Blender",
  "motion",
];

const COLORS = {
  green: "#00ff88", // ターミナルグリーン（メイン）
  greenDim: "#00aa55", // 暗めのグリーン（サブ）
  blue: "#4488ff", // コード系ブルー
  cyan: "#00ccff", // サイアン（コメント風）
  gray: "#445566", // 暗いグレー（背景に馴染む）
  white: "#ccddcc", // 薄いホワイト
};

/* テキスト配置設定
  position: [x, y, z] で位置を調整
    x: 左右（マイナスで左、プラスで右）
    y: 上下（マイナスで下、プラスで上）
    z: 奥行き（マイナスで奥）
  speed: ふわふわの速さ（0.2〜0.5 推奨）
  phase: 動きのタイミングをずらす値（0〜6 の範囲でバラけさせる）
  baseOpacity: 透明度の上限（0.3〜0.7 推奨、大きすぎると背景がうるさくなる）
*/

type FloatText = {
  text: string;
  position: [number, number, number];
  speed: number; // ふわふわの速さ（大きいほど速い）
  phase: number; // アニメーションの位相（バラけさせるため）
  baseOpacity: number; // 基本の透明度（0〜1）
  color: string;
  fontSize: number;
  rotation?: [number, number, number];
};
type FloatText3D = {
  text: string;
  position: [number, number, number];
  speed: number;
  phase: number;
  baseOpacity: number;
  color: string;
  size: number; // 3Dテキストのサイズ
  rotation?: [number, number, number];
};
export const FloatingTexts = () => {
  const flatItems: FloatText[] = useMemo(
    () => [
      // --- 左側のコードブロック ---
      {
        text: WORDS[0],
        position: [-10, 2.0, -7],
        speed: 0.28,
        phase: 0.0,
        baseOpacity: 0.55,
        color: COLORS.green,
        fontSize: 0.2,
      },
      {
        text: WORDS[1],
        position: [-10, 0.8, -7],
        speed: 0.32,
        phase: 1.5,
        baseOpacity: 0.4,
        color: COLORS.cyan,
        fontSize: 0.17,
      },
      {
        text: WORDS[2],
        position: [-10, -0.5, -7],
        speed: 0.25,
        phase: 3.0,
        baseOpacity: 0.35,
        color: COLORS.gray,
        fontSize: 0.16,
      },
      {
        text: WORDS[3],
        position: [-10, -1.8, -7],
        speed: 0.38,
        phase: 4.5,
        baseOpacity: 0.45,
        color: COLORS.green,
        fontSize: 0.18,
      },
      // --- 右側のコードブロック ---
      {
        text: WORDS[4],
        position: [3.5, 2.5, -8],
        speed: 0.3,
        phase: 0.7,
        baseOpacity: 0.5,
        color: COLORS.green,
        fontSize: 0.19,
      },
      {
        text: WORDS[5],
        position: [3.5, 1.2, -8],
        speed: 0.22,
        phase: 2.2,
        baseOpacity: 0.6,
        color: COLORS.cyan,
        fontSize: 0.17,
      },
      {
        text: WORDS[6],
        position: [3.5, -0.2, -8],
        speed: 0.35,
        phase: 5.1,
        baseOpacity: 0.35,
        color: COLORS.blue,
        fontSize: 0.18,
      },
      {
        text: WORDS[7],
        position: [3.5, -1.5, -8],
        speed: 0.27,
        phase: 1.0,
        baseOpacity: 0.4,
        color: COLORS.green,
        fontSize: 0.2,
      },
      // --- 奥の薄いコード（奥行き感を出す） ---
      {
        text: WORDS[8],
        position: [-7, 3.0, -10],
        speed: 0.2,
        phase: 2.8,
        baseOpacity: 0.25,
        color: COLORS.greenDim,
        fontSize: 0.22,
      },
      {
        text: WORDS[9],
        position: [-7, 1.5, -10],
        speed: 0.18,
        phase: 0.3,
        baseOpacity: 0.2,
        color: COLORS.gray,
        fontSize: 0.18,
      },
      {
        text: WORDS[10],
        position: [5, 2.0, -10],
        speed: 0.23,
        phase: 4.0,
        baseOpacity: 0.22,
        color: COLORS.greenDim,
        fontSize: 0.2,
      },
      {
        text: WORDS[11],
        position: [5, 0.5, -10],
        speed: 0.19,
        phase: 1.8,
        baseOpacity: 0.18,
        color: COLORS.gray,
        fontSize: 0.17,
      },
      // --- Linux コマンド系 ---
      {
        text: WORDS[12],
        position: [-12, 0.0, -9],
        speed: 0.26,
        phase: 3.3,
        baseOpacity: 0.3,
        color: COLORS.white,
        fontSize: 0.16,
      },
      {
        text: WORDS[13],
        position: [-12, -1.5, -9],
        speed: 0.31,
        phase: 5.5,
        baseOpacity: 0.25,
        color: COLORS.gray,
        fontSize: 0.15,
      },
      {
        text: WORDS[14],
        position: [7, 1.0, -9],
        speed: 0.24,
        phase: 2.0,
        baseOpacity: 0.28,
        color: COLORS.cyan,
        fontSize: 0.16,
      },
      // --- その他 ---
      {
        text: WORDS[15],
        position: [-4, 3.8, -9],
        speed: 0.21,
        phase: 0.9,
        baseOpacity: 0.35,
        color: COLORS.blue,
        fontSize: 0.19,
      },
      {
        text: WORDS[16],
        position: [1, 3.5, -9],
        speed: 0.29,
        phase: 4.7,
        baseOpacity: 0.3,
        color: COLORS.greenDim,
        fontSize: 0.17,
      },
    ],
    [],
  );

  const items3D: FloatText3D[] = useMemo(
    () => [
      {
        text: WORDS_3D[0],
        position: [-8, 1.0, -5],
        speed: 0.25,
        phase: 0.0,
        baseOpacity: 0.45,
        color: COLORS.green,
        size: 0.35,
      },
      {
        text: WORDS_3D[1],
        position: [4, -0.5, -6],
        speed: 0.3,
        phase: 2.1,
        baseOpacity: 0.4,
        color: COLORS.cyan,
        size: 0.3,
      },
      {
        text: WORDS_3D[2],
        position: [-5, 2.5, -6],
        speed: 0.22,
        phase: 1.3,
        baseOpacity: 0.35,
        color: COLORS.blue,
        size: 0.28,
      },
      {
        text: WORDS_3D[3],
        position: [6, 1.5, -6],
        speed: 0.28,
        phase: 3.5,
        baseOpacity: 0.4,
        color: COLORS.green,
        size: 0.25,
      },
      {
        text: WORDS_3D[4],
        position: [-9, -0.8, -6],
        speed: 0.2,
        phase: 5.0,
        baseOpacity: 0.3,
        color: COLORS.white,
        size: 0.32,
      },
      {
        text: WORDS_3D[5],
        position: [2, 3.2, -7],
        speed: 0.33,
        phase: 0.6,
        baseOpacity: 0.5,
        color: COLORS.green,
        size: 0.4,
      },
      {
        text: WORDS_3D[6],
        position: [-3, -1.5, -5],
        speed: 0.27,
        phase: 4.2,
        baseOpacity: 0.38,
        color: COLORS.cyan,
        size: 0.28,
      },
      {
        text: WORDS_3D[7],
        position: [8, 0.0, -7],
        speed: 0.23,
        phase: 2.8,
        baseOpacity: 0.35,
        color: COLORS.greenDim,
        size: 0.36,
      },
      {
        text: WORDS_3D[8],
        position: [-6, 3.5, -8],
        speed: 0.19,
        phase: 1.7,
        baseOpacity: 0.28,
        color: COLORS.blue,
        size: 0.26,
      },
      {
        text: WORDS_3D[9],
        position: [1, -2.0, -6],
        speed: 0.31,
        phase: 3.9,
        baseOpacity: 0.42,
        color: COLORS.green,
        size: 0.3,
      },
    ],
    [],
  );

  return (
    <>
      {flatItems.map((item, i) => (
        <FloatText key={`flat-${i}`} {...item} />
      ))}
      {items3D.map((item, i) => (
        <FloatText3D key={`3d-${i}`} {...item} />
      ))}
    </>
  );
};


const AvatarConfigScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[-1, 1, 5]} fov={45} />

      {/* <color attach={"background"} args={["#0d1117"]} /> */}
     
      {/* フォグ: 奥のテキストを自然に消す。第3引数で消え始め、第4引数で完全に消える距離 */}
      <fog attach={"fog"} args={["#0d1117", 15, 38]} />

      <group position-y={-0.8}>
        <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 12}
          maxAzimuthAngle={Math.PI / 12}
          enableZoom={false}
          enablePan={false}
        />

        {/* -----照明----- */}
        {/* sunsetプリセット: アバターの肌色を自然に見せる暖色系の環境光 */}
        {/* environmentIntensityを上げすぎるとアバターが緑・青に染まるので注意 */}
        <Environment preset="sunset" environmentIntensity={0.3} />
        <SoftShadows size={52} samples={16} />

        {/* キーライト: アバター正面を白色でしっかり照らす */}
        {/* intensityを上げるほど明るくなる。色を変えるとアバターの見た目が変わるので白推奨 */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          color={"#ffffff"}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* バックライト（背面）: アバターの輪郭に色を乗せる */}
        {/* アバターの前面には届きにくい位置なので色付きでもパーツ色への影響が少ない */}
        {/* intensityを上げすぎると背面から色が回り込むので注意 */}
        <directionalLight
          position={[1, 0.1, -5]}
          intensity={2}
          color={"#00ff88"}
        />
        <directionalLight
          position={[-1, 0.1, -5]}
          intensity={2}
          color={"#4488ff"}
        />

        {/* 足元ライト: グリッドとの接地感を補助 */}
        {/* アバターの足元にだけ当たるよう position-y を低めに設定 */}
        <pointLight position={[0, -0.5, 1]} intensity={0.8} color={"#00ff88"} />

        {/* グリッド: ターミナル風のグリーン系グリッド */}
        {/* cellSize: 小グリッドの間隔 / sectionSize: 大グリッドの間隔 */}
        {/* sectionColor を変えると大グリッドの色が変わる */}
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

        {/* 足元の影 */}
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.6}
          scale={5}
          blur={2}
          far={2}
          color={"#001a0a"}
        />

        {/* 浮遊テキスト群 */}
        <FloatingTexts />

        <Avatar />
      </group>
    </>
  );
};

export default AvatarConfigScene;
