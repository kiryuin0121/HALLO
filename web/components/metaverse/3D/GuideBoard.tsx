import React, { useRef } from 'react'
import { Text } from '@react-three/drei'
import { Mesh } from 'three'

/*  
  はろー。メタバースHALLOへようこそ。
  1.矢印キーを使って空間内を移動することができます。
  2.まずは、画面のしたあたりにフォームに「はろー」と入力し、みんなに挨拶してみましょう。
  3.ほかの人をクリックすると、話しかけてみたり、その人のことを詳しく知ることができますよ。
*/

// ============================================================
// 【ボードのサイズ定数】
// ここを変えるとボード全体のサイズが変わります。
// BOARD_WIDTH  : ボードの横幅。大きくすると横に広がります。
// BOARD_HEIGHT : ボードの縦幅。大きくすると縦に伸びます。
// BOARD_THICKNESS : ボードの厚み。大きくすると分厚い板になります。
// ============================================================
const BOARD_WIDTH = 5.5
const BOARD_HEIGHT = 4.0
const BOARD_THICKNESS = 0.1

// ============================================================
// 【支柱の定数】
// POST_RADIUS : 支柱の太さ（半径）。大きくすると太い柱になります。
// POST_HEIGHT : 支柱の高さ。大きくするとボードが高い位置に上がります。
//               ボード自体の位置（boardY）はこの値に依存しています。
// ============================================================
const POST_RADIUS = 0.07
const POST_HEIGHT = 3

// ============================================================
// 【掲示板に表示するガイドテキスト】
// 改行やインデントはそのまま3D空間に反映されます。
// ============================================================
const guideText = `はろー。メタバースHALLOへようこそ。

1. 矢印キーを使って空間内を移動することができます。

2. まずは、画面下のフォームに「はろー」と入力し、
    みんなに挨拶してみましょう。

3. ほかの参加者をクリックしてみましょう。
    通話やプロフィールの確認ができます。
`;

// ============================================================
// 【GuideBoardコンポーネント】
// HALLOへようこそ案内を表示する黒板掲示板です。
//
// <GuideBoard /> と配置するだけで動作します。
// 位置・回転は呼び出し元（親）で自由に指定してください。
//   例: <GuideBoard position={[75, 0.5, -43]} rotation-y={Math.PI / 4} />
// ============================================================
const GuideBoard = () => {
  const boardRef = useRef<Mesh>(null)

  // ----------------------------------------
  // 【位置の計算】
  // postY  : 支柱メッシュの中心Y座標
  //          支柱は地面(y=0)から生えるので、高さの半分が中心になります。
  //          - 0.5 はグループ全体の position-y オフセット分の調整です。
  // boardY : ボード本体の中心Y座標
  //          支柱の上端付近にボードを配置するため POST_HEIGHT - 0.5 にしています。
  //          この値を増やすとボードが上に、減らすと下に移動します。
  // ----------------------------------------
  const postY = POST_HEIGHT / 2 - 0.5
  const boardY = POST_HEIGHT - 0.5

  return (
    // --------------------------------------------------------
    // 【group の position / rotation-y】
    // ここで掲示板全体のワールド座標と向きを指定します。
    // position={[x, y, z]} : x=左右, y=上下, z=前後
    // rotation-y           : Y軸回転（ラジアン）
    //                        Math.PI / 4 = 45度斜め向き
    //                        Math.PI / 2 = 90度横向き
    //                        0           = 正面向き
    // --------------------------------------------------------
    <group position={[75, 0.5, -43]} rotation-y={Math.PI / 4}>

      {/* ==================== 支柱 左 ==================== */}
      {/* position x : ボード左端より少し内側に配置 */}
      {/* POST_HEIGHT : 支柱の長さ＝高さ */}
      <mesh position={[-BOARD_WIDTH / 2 + 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        {/* color : 金属グレー。roughness低め/metalness高めで光沢感を出しています */}
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* 支柱キャップ 左（ポールの頭の丸い蓋）*/}
      {/* boardY + BOARD_HEIGHT/2 + 0.08 : ボード上端より少し上に配置 */}
      <mesh position={[-BOARD_WIDTH / 2 + 0.22, boardY + BOARD_HEIGHT / 2 + 0.08, 0]}>
        {/* args: [上半径, 下半径, 高さ, 分割数] */}
        <cylinderGeometry args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ==================== 支柱 右 ==================== */}
      <mesh position={[BOARD_WIDTH / 2 - 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[BOARD_WIDTH / 2 - 0.22, boardY + BOARD_HEIGHT / 2 + 0.08, 0]}>
        <cylinderGeometry args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ==================== ボード本体 ==================== */}
      {/* color #2b4a3a : 黒板らしい深緑。明るくすると緑黒板、暗くすると黒板に近づきます */}
      {/* roughness 0.95 : ほぼマット。チョーク面の質感を表現しています */}
      <mesh ref={boardRef} position={[0, boardY, 0]} castShadow receiveShadow>
        <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_THICKNESS]} />
        <meshStandardMaterial color="#2b4a3a" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* ==================== 上部タイトルバー ==================== */}
      {/* boardY + BOARD_HEIGHT/2 - 0.2 : ボード上端から0.2下がった位置 */}
      {/* 0.35 : バーの高さ。大きくするとタイトル帯が太くなります */}
      {/* color #6b3a2a : 木製チョークトレイ風の茶色 */}
      <mesh position={[0, boardY + BOARD_HEIGHT / 2 - 0.2, BOARD_THICKNESS / 2 + 0.005]}>
        <boxGeometry args={[BOARD_WIDTH, 0.35, 0.015]} />
        <meshStandardMaterial color="#6b3a2a" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* タイトルテキスト */}
      {/* fontSize : 文字サイズ。大きくすると文字が大きくなります */}
      {/* letterSpacing : 文字間隔。大きくすると文字が広がります */}
      <Text
        position={[0, boardY + BOARD_HEIGHT / 2 - 0.2, BOARD_THICKNESS / 2 + 0.025]}
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
      {/* タイトルバーの下に引くチョーク風の横線 */}
      {/* boardY + BOARD_HEIGHT/2 - 0.42 : タイトルバー下端の少し下 */}
      <mesh position={[0, boardY + BOARD_HEIGHT / 2 - 0.42, BOARD_THICKNESS / 2 + 0.005]}>
        <boxGeometry args={[BOARD_WIDTH - 0.4, 0.012, 0.008]} />
        {/* color #c8c0a8 : チョークで引いたような白に近いベージュ */}
        <meshStandardMaterial color="#c8c0a8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* ==================== ガイド本文 ==================== */}
      {/* position y の boardY - 0.22 : タイトルバーを避けて本文を少し下げています */}
      {/* lineHeight : 行間。大きくすると行間が広がります */}
      {/* maxWidth : テキストの折り返し幅。BOARD_WIDTHより小さくして余白を確保しています */}
      <Text
        position={[0.1, boardY - 0.22, BOARD_THICKNESS / 2 + 0.02]}
        fontSize={0.142}
        color="#ddd8c4"
        anchorX="center"
        anchorY="middle"
        font="/fonts/NotoSansJP-Medium.ttf"
        maxWidth={BOARD_WIDTH - 0.55}
        textAlign="left"
        lineHeight={1.75}
        letterSpacing={0.01}
      >
        {guideText}
      </Text>

      {/* ==================== ボルト（四隅）==================== */}
      {/* 掲示板の四隅にある金属ボルトです */}
      {/* x, y はボードの端からのオフセットで指定しています */}
      {([
        [-BOARD_WIDTH / 2 + 0.18,  BOARD_HEIGHT / 2 - 0.15], // 左上
        [ BOARD_WIDTH / 2 - 0.18,  BOARD_HEIGHT / 2 - 0.15], // 右上
        [-BOARD_WIDTH / 2 + 0.18, -BOARD_HEIGHT / 2 + 0.15], // 左下
        [ BOARD_WIDTH / 2 - 0.18, -BOARD_HEIGHT / 2 + 0.15], // 右下
      ] as [number, number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, boardY + y, BOARD_THICKNESS / 2 + 0.02]}>
          {/* args: [上半径, 下半径, 高さ, 分割数(6=六角形)] */}
          <cylinderGeometry args={[0.045, 0.045, 0.04, 6]} />
          {/* metalness 0.95 / roughness 0.15 : 金属光沢のあるボルト */}
          <meshStandardMaterial color="#888888" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* ==================== チョークトレイ（下部）==================== */}
      {/* ボード下端のすぐ下に取り付けられた木製トレイ */}
      {/* boardY - BOARD_HEIGHT/2 - 0.06 : ボード下端から少し下の位置 */}
      {/* z の + 0.05 : ボード面より少し手前に飛び出させてトレイらしくしています */}
      <mesh position={[0, boardY - BOARD_HEIGHT / 2 - 0.06, BOARD_THICKNESS / 2 + 0.05]}>
        <boxGeometry args={[BOARD_WIDTH - 0.1, 0.1, 0.12]} />
        <meshStandardMaterial color="#5a3020" roughness={0.85} metalness={0.0} />
      </mesh>

    </group>
  )
}

export default GuideBoard