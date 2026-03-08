import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = {
  text: string;
  position: [number, number, number];
  speed: number;
  phase: number;
  baseOpacity: number;
  color: string;
  fontSize: number;        // 3Dテキストのサイズ
  rotation?: [number, number, number];
}
const FloatText = ({
  text,
  position,
  speed,
  phase,
  baseOpacity,
  color,
  fontSize,
  rotation = [0, 0, 0],
}: Props) => {
  const ref = useRef<any>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // 上下にゆっくり浮遊
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.35;
    // sin波で透明度を変化させ点滅感を出す
    // baseOpacity を上限に、0.1〜baseOpacity の範囲で変動
    ref.current.material.opacity =
      baseOpacity * (0.3 + Math.abs(Math.sin(t * speed * 0.5 + phase)) * 0.7);
  });

  return (
    <Text
      ref={ref}
      position={position}
      rotation={rotation}
      fontSize={fontSize}
      color={color}
      font="/fonts/DotGothic16-Regular.ttf"
      anchorX="left"
      anchorY="middle"
      material-transparent
      material-opacity={baseOpacity}
      // depthWrite=falseで半透明の重なりを綺麗に
      material-depthWrite={false}
    >
      {text}
    </Text>
  );
};

export default FloatText;