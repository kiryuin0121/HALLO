import React, { useRef } from 'react'
import { Text } from '@react-three/drei'
import { Mesh } from 'three'

/*  
  はろー。メタバースHALLOへようこそ。
  1.矢印キーを使って空間内を移動することができます。
  2.まずは、画面のしたあたりにフォームに「はろー」と入力し、みんなに挨拶してみましょう。
  3.ほかの人をクリックすると、話しかけてみたり、その人のことを詳しく知ることができますよ。
*/

const BOARD_WIDTH = 5.5
const BOARD_HEIGHT = 4.0
const BOARD_THICKNESS = 0.1
const POST_RADIUS = 0.07
const POST_HEIGHT = 3

// ===== 共通：黒板コンポーネント =====
type ChalkboardProps = {
  title: string
  children: React.ReactNode
}

const Chalkboard = ({ title, children }: ChalkboardProps) => {
  const boardRef = useRef<Mesh>(null)
  const postY = POST_HEIGHT / 2 - 0.5
  const boardY = POST_HEIGHT - 0.5

  return (
    <group>
      {/* 支柱 左 */}
      <mesh position={[-BOARD_WIDTH / 2 + 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-BOARD_WIDTH / 2 + 0.22, boardY + BOARD_HEIGHT / 2 + 0.08, 0]}>
        <cylinderGeometry args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* 支柱 右 */}
      <mesh position={[BOARD_WIDTH / 2 - 0.22, postY, 0]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[BOARD_WIDTH / 2 - 0.22, boardY + BOARD_HEIGHT / 2 + 0.08, 0]}>
        <cylinderGeometry args={[POST_RADIUS * 1.4, POST_RADIUS * 1.4, 0.1, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ボード本体 */}
      <mesh ref={boardRef} position={[0, boardY, 0]} castShadow receiveShadow>
        <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_THICKNESS]} />
        <meshStandardMaterial color="#2b4a3a" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 上部タイトルバー */}
      <mesh position={[0, boardY + BOARD_HEIGHT / 2 - 0.2, BOARD_THICKNESS / 2 + 0.005]}>
        <boxGeometry args={[BOARD_WIDTH, 0.35, 0.015]} />
        <meshStandardMaterial color="#6b3a2a" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* タイトルテキスト */}
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
        {title}
      </Text>

      {/* 区切り線 */}
      <mesh position={[0, boardY + BOARD_HEIGHT / 2 - 0.42, BOARD_THICKNESS / 2 + 0.005]}>
        <boxGeometry args={[BOARD_WIDTH - 0.4, 0.012, 0.008]} />
        <meshStandardMaterial color="#c8c0a8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* ボルト四隅 */}
      {([
        [-BOARD_WIDTH / 2 + 0.18,  BOARD_HEIGHT / 2 - 0.15],
        [ BOARD_WIDTH / 2 - 0.18,  BOARD_HEIGHT / 2 - 0.15],
        [-BOARD_WIDTH / 2 + 0.18, -BOARD_HEIGHT / 2 + 0.15],
        [ BOARD_WIDTH / 2 - 0.18, -BOARD_HEIGHT / 2 + 0.15],
      ] as [number, number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, boardY + y, BOARD_THICKNESS / 2 + 0.02]}>
          <cylinderGeometry args={[0.045, 0.045, 0.04, 6]} />
          <meshStandardMaterial color="#888888" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* チョークトレイ（下部） */}
      <mesh position={[0, boardY - BOARD_HEIGHT / 2 - 0.06, BOARD_THICKNESS / 2 + 0.05]}>
        <boxGeometry args={[BOARD_WIDTH - 0.1, 0.1, 0.12]} />
        <meshStandardMaterial color="#5a3020" roughness={0.85} metalness={0.0} />
      </mesh>

      {children}
    </group>
  )
}

// ===== 張り紙コンポーネント =====
type NoticeProps = {
  x: number
  y: number
  z: number
  width: number
  height: number
  bgColor: string
  pinColor: string
  titleText: string
  bodyText: string
  tiltZ?: number
}

const Notice = ({
  x, y, z, width, height, bgColor, pinColor,
  titleText, bodyText, tiltZ = 0
}: NoticeProps) => (
  <group position={[x, y, z]} rotation-z={tiltZ}>
    <mesh>
      <boxGeometry args={[width, height, 0.012]} />
      <meshStandardMaterial color={bgColor} roughness={0.95} metalness={0.0} />
    </mesh>
    <mesh position={[0, 0, -0.007]}>
      <boxGeometry args={[width + 0.02, height + 0.02, 0.005]} />
      <meshStandardMaterial color="#000000" roughness={1} metalness={0} transparent opacity={0.18} />
    </mesh>
    {/* 画鋲 */}
    <mesh position={[0, height / 2 - 0.06, 0.018]}>
      <sphereGeometry args={[0.04, 10, 10]} />
      <meshStandardMaterial color={pinColor} metalness={0.8} roughness={0.2} />
    </mesh>
    {/* タイトル */}
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
    {/* 区切り */}
    <mesh position={[0, height / 2 - 0.32, 0.015]}>
      <boxGeometry args={[width - 0.15, 0.008, 0.005]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </mesh>
    {/* 本文 */}
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
)

// ===== 1枚目：ガイド黒板 =====
const GuideBoard = () => {
  const boardY = POST_HEIGHT - 0.5

  const guideText = `はろー。メタバースHALLOへようこそ。

1. 矢印キーを使って空間内を移動することができます。

2. まずは、画面の下のフォームに「はろー」と入力し、
   みんなに挨拶してみましょう。

3. ほかの人をクリックすると、話しかけてみたり、
   その人のことを詳しく知ることができますよ。`

  return (
    <group position={[75, 0.5, -43]} rotation-y={Math.PI / 4}>
      <Chalkboard title="HALLO掲示板">
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
      </Chalkboard>
    </group>
  )
}

// ===== 2枚目：張り紙掲示板 =====
const NoticeBoard = () => {
  const boardY = POST_HEIGHT - 0.5

  const featureText = `・アバター移動（矢印キー）
・チャット機能
・他ユーザーへの話しかけ
・プロフィール閲覧
・スペース内オブジェクト操作
・イベント参加 / 作成`

  const friendText = `【フレンド募集中！】

一緒にHALLOを楽しめる
仲間を探しています♪

・のんびり雑談したい方
・一緒にイベント回りたい方
・ゲーム好きな方 大歓迎！

気軽に話しかけてください😊`

  return (
    <group position={[81, 0.5, -37]} rotation-y={Math.PI / 4}>
      <Chalkboard title="お知らせ掲示板">
        {/* 張り紙①：機能一覧（左・薄黄色）*/}
        <Notice
          x={-1.3}
          y={boardY + 0.3}
          z={BOARD_THICKNESS / 2 + 0.02}
          width={2.2}
          height={2.2}
          bgColor="#fefae0"
          pinColor="#e63946"
          titleText="📋 HALの機能一覧"
          bodyText={featureText}
          tiltZ={-0.03}
        />
        {/* 張り紙②：友達募集（右・薄ピンク）*/}
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
      </Chalkboard>
    </group>
  )
}

// ===== エクスポート =====
const Guide = () => (
  <>
    <GuideBoard />
    <NoticeBoard />
  </>
)

export default Guide