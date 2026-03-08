import React, { useRef } from "react";
import { Text } from "@react-three/drei";
import { Mesh } from "three";

// 板
const BOARD_WIDTH = 5.5;
const BOARD_HEIGHT = 4.0;
const BOARD_THICKNESS = 0.1;
// 柱
const POST_RADIUS = 0.07;
const POST_HEIGHT = 3;

// ============================================================
// 【張り紙コンポーネントの型定義】
// x, y, z    : 張り紙の中心座標（ボードのローカル座標系）
// width      : 張り紙の横幅
// height     : 張り紙の縦幅
// bgColor    : 紙の背景色（例: "#fefae0" = 薄黄色）
// pinColor   : 画鋲の色
// titleText  : 張り紙上部のタイトル文字列
// bodyText   : 張り紙の本文テキスト
// tiltZ      : Z軸回転（ラジアン）。少し傾けると貼り付けた感が出ます。
//              例: 0.03 = わずかに右上がり, -0.03 = わずかに左上がり
// ============================================================
type NoticeProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  bgColor: string;
  pinColor: string;
  titleText: string;
  bodyText: string;
  tiltZ?: number;
};

// ============================================================
// 【Noticeコンポーネント】
// 黒板に貼られた1枚の張り紙を表します。
// NoticeBoardの中で複数使われています。
// ============================================================
const Notice = ({
  x,
  y,
  z,
  width,
  height,
  bgColor,
  pinColor,
  titleText,
  bodyText,
  tiltZ = 0,
}: NoticeProps) => (
  // tiltZ で張り紙をわずかに傾けて「手で貼った感」を演出
  <group position={[x, y, z]} rotation-z={tiltZ}>
    {/* -------------------- 紙本体 -------------------- */}
    {/* width x height のサイズの薄い板 */}
    {/* roughness 0.95 : マット紙の質感 */}
    <mesh>
      <boxGeometry args={[width, height, 0.012]} />
      <meshStandardMaterial color={bgColor} roughness={0.95} metalness={0.0} />
    </mesh>

    {/* 紙の影（紙の後ろにわずかに大きい暗い板を重ねて影を表現）*/}
    {/* opacity を下げると影が薄くなります */}
    <mesh position={[0, 0, -0.007]}>
      <boxGeometry args={[width + 0.02, height + 0.02, 0.005]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={0.18}
        roughness={1}
        metalness={0}
      />
    </mesh>

    {/* -------------------- 画鋲 -------------------- */}
    {/* 紙の上端中央に配置。pinColor で色を変えられます */}
    {/* position y : height/2 - 0.06 = 紙の上端から少し下がった位置 */}
    <mesh position={[0, height / 2 - 0.06, 0.018]}>
      <sphereGeometry args={[0.04, 10, 10]} />
      <meshStandardMaterial color={pinColor} metalness={0.8} roughness={0.2} />
    </mesh>

    {/* -------------------- タイトル -------------------- */}
    {/* 紙の上部に表示される見出し */}
    {/* position y : height/2 - 0.18 = 上端からやや下 */}
    <Text
      position={[0, height / 2 - 0.18, 0.02]}
      fontSize={0.13}
      color="#1a1a1a"
      anchorX="center"
      anchorY="middle"
      font="/fonts/NotoSansJP-Medium.ttf"
      maxWidth={width - 0.15}
      textAlign="center"
      letterSpacing={0.04}
    >
      {titleText}
    </Text>

    {/* -------------------- タイトル下の区切り線 -------------------- */}
    {/* height/2 - 0.32 : タイトルの少し下 */}
    <mesh position={[0, height / 2 - 0.32, 0.015]}>
      <boxGeometry args={[width - 0.15, 0.008, 0.005]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </mesh>

    {/* -------------------- 本文 -------------------- */}
    {/* position y -0.05 : 紙全体の中心より少し下。ここを変えると本文の縦位置が動きます */}
    {/* fontSize : 小さめにして張り紙らしいサイズ感に */}
    {/* lineHeight : 行間。大きくすると余裕のある読みやすいレイアウトになります */}
    <Text
      position={[0, -0.05, 0.02]}
      fontSize={0.1}
      color="#2a2a2a"
      anchorX="center"
      anchorY="middle"
      font="/fonts/NotoSansJP-Medium.ttf"
      maxWidth={width - 0.2}
      textAlign="left"
      lineHeight={1.65}
      letterSpacing={0.01}
    >
      {bodyText}
    </Text>
  </group>
);

// ============================================================
// 【NoticeBoardコンポーネント】
// 張り紙が複数貼られたお知らせ掲示板です。
// GuideBoardとは座標の依存関係はありません。
// それぞれ独立して <GuideBoard /> <NoticeBoard /> と配置できます。
//
// 配置例（親コンポーネントで）:
//   <GuideBoard />               ← position は各コンポーネント内で完結
//   <NoticeBoard />              ← こちらも独立した座標を持ちます
// ============================================================
const NoticeBoard = () => {
  const boardRef = useRef<Mesh>(null);

  // ----------------------------------------
  // 【位置の計算】
  // postY  : 支柱メッシュの中心Y座標
  // boardY : ボード本体の中心Y座標
  //          ここを変えるとボードの上下位置が変わります。
  //          GuideBoardと同じ計算式なのでボードの高さが揃います。
  // ----------------------------------------
  const postY = POST_HEIGHT / 2 - 0.5;
  const boardY = POST_HEIGHT - 0.5;

  // ----------------------------------------
  // 【張り紙テキスト①：機能一覧】
  // ----------------------------------------
  const featureText = `・ユーザー認証機能
・カスタムアバター機能
・リアルタイム同期機能(座標/回転/メッセージ)
・おはなし機能(グローバル/個別)
・プロフィール機能
・DM機能
・ユーザー検索機能
・サウンド制御機能(ボイス/BGM)
`;

  // ----------------------------------------
  // 【張り紙テキスト②：友達募集】
  // ----------------------------------------
  const friendText = `【フレンド募集中！】

一緒にHALLOを楽しめる
仲間を探しています♪

・のんびり雑談したい方
・一緒にイベント回りたい方
・ゲーム好きな方 大歓迎！

気軽に話しかけてください😊`;

  return (
    // --------------------------------------------------------
    // 【group の position / rotation-y】
    // GuideBoardとは完全に独立した座標です。
    // この掲示板だけ移動・回転させても GuideBoardには影響しません。
    //
    // position={[x, y, z]} :
    //   x を増やすと右へ、減らすと左へ移動します。
    //   y を増やすと上へ、減らすと下へ移動します。
    //   z を増やすと手前へ、減らすと奥へ移動します。
    //
    // rotation-y :
    //   Math.PI / 4  = 45度（GuideBoardと同じ向き）
    //   0            = 正面向き
    //   -Math.PI / 4 = 逆45度
    // --------------------------------------------------------
    <group position={[81.9, 0.5, -37.4]} rotation-y={Math.PI / 4}>
      {/* ==================== 支柱 左 ==================== */}
      <mesh position={[-BOARD_WIDTH / 2 + 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh
        position={[
          -BOARD_WIDTH / 2 + 0.22,
          boardY + BOARD_HEIGHT / 2 + 0.08,
          0,
        ]}
      >
        <cylinderGeometry
          args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]}
        />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ==================== 支柱 右 ==================== */}
      <mesh position={[BOARD_WIDTH / 2 - 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh
        position={[BOARD_WIDTH / 2 - 0.22, boardY + BOARD_HEIGHT / 2 + 0.08, 0]}
      >
        <cylinderGeometry
          args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]}
        />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ==================== ボード本体 ==================== */}
      <mesh ref={boardRef} position={[0, boardY, 0]} castShadow receiveShadow>
        <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_THICKNESS]} />
        <meshStandardMaterial
          color="#2b4a3a"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* ==================== 上部タイトルバー ==================== */}
      <mesh
        position={[
          0,
          boardY + BOARD_HEIGHT / 2 - 0.2,
          BOARD_THICKNESS / 2 + 0.005,
        ]}
      >
        <boxGeometry args={[BOARD_WIDTH, 0.35, 0.015]} />
        <meshStandardMaterial
          color="#6b3a2a"
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* タイトルテキスト */}
      <Text
        position={[
          0,
          boardY + BOARD_HEIGHT / 2 - 0.2,
          BOARD_THICKNESS / 2 + 0.025,
        ]}
        fontSize={0.2}
        color="#f0ece0"
        anchorX="center"
        anchorY="middle"
        font="/fonts/NotoSansJP-Medium.ttf"
        maxWidth={BOARD_WIDTH - 0.4}
        textAlign="center"
        letterSpacing={0.08}
      >
        HALLO掲示板
      </Text>

      {/* ==================== 区切り線 ==================== */}
      <mesh
        position={[
          0,
          boardY + BOARD_HEIGHT / 2 - 0.42,
          BOARD_THICKNESS / 2 + 0.005,
        ]}
      >
        <boxGeometry args={[BOARD_WIDTH - 0.4, 0.012, 0.008]} />
        <meshStandardMaterial color="#c8c0a8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* ==================== ボルト（四隅）==================== */}
      {(
        [
          [-BOARD_WIDTH / 2 + 0.18, BOARD_HEIGHT / 2 - 0.15], // 左上
          [BOARD_WIDTH / 2 - 0.18, BOARD_HEIGHT / 2 - 0.15], // 右上
          [-BOARD_WIDTH / 2 + 0.18, -BOARD_HEIGHT / 2 + 0.15], // 左下
          [BOARD_WIDTH / 2 - 0.18, -BOARD_HEIGHT / 2 + 0.15], // 右下
        ] as [number, number][]
      ).map(([x, y], i) => (
        <mesh key={i} position={[x, boardY + y, BOARD_THICKNESS / 2 + 0.02]}>
          <cylinderGeometry args={[0.045, 0.045, 0.04, 6]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      ))}

      {/* ==================== チョークトレイ（下部）==================== */}
      <mesh
        position={[
          0,
          boardY - BOARD_HEIGHT / 2 - 0.06,
          BOARD_THICKNESS / 2 + 0.05,
        ]}
      >
        <boxGeometry args={[BOARD_WIDTH - 0.1, 0.1, 0.12]} />
        <meshStandardMaterial
          color="#5a3020"
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* ==================== 張り紙①：機能一覧 ==================== */}
      {/*
        x=-1.3  : ボード中心から左へ1.3ずれた位置（左半分に配置）
        y=boardY+0.3 : ボード中心より少し上
        z=BOARD_THICKNESS/2+0.02 : ボード表面より少し手前
        width=2.2, height=2.2 : 正方形に近い張り紙サイズ
        tiltZ=-0.03 : わずかに左上がりに傾けて貼り付け感を演出
      */}
      <Notice
        x={-1.3}
        y={boardY + 0.3}
        z={BOARD_THICKNESS / 2 + 0.02}
        width={2.2}
        height={2.2}
        bgColor="#fefae0"
        pinColor="#e63946"
        titleText="📋 HALLOの機能一覧"
        bodyText={featureText}
        tiltZ={-0.03}
      />

      {/* ==================== 張り紙②：友達募集 ==================== */}
      {/*
        x=1.3   : ボード中心から右へ1.3ずれた位置（右半分に配置）
        y=boardY+0.15 : ボード中心より少し上（①より少し低くしてずらし感を出す）
        z=BOARD_THICKNESS/2+0.025 : ①より少し手前（重なり順を制御）
        width=2.2, height=2.5 : 縦長の張り紙
        tiltZ=0.04 : わずかに右上がりに傾けて、①と逆方向にして自然な見た目に
      */}
      <Notice
        x={1.3}
        y={boardY + 0.15}
        z={BOARD_THICKNESS / 2 + 0.025}
        width={2.2}
        height={2.5}
        bgColor="#fff0f3"
        pinColor="#f4a261"
        titleText="👋 友達募集中！"
        bodyText={friendText}
        tiltZ={0.04}
      />
    </group>
  );
};

export default NoticeBoard;
