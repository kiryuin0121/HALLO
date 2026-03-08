import { useEffect, useRef, useState } from "react";

export const useTypewriter = (text: string, speed = 40) => {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const genRef = useRef(0);

  useEffect(() => {
    genRef.current += 1;          // 世代を進める
    const myGen = genRef.current;

    setDisplayText([]);

    const tick = (i: number) => {
      // 自分の世代でなければ無効
      if (genRef.current !== myGen) return;
      if (i >= text.length) return;

      setDisplayText(prev => [...prev, text[i]]);

      setTimeout(() => tick(i + 1), speed);
    };

    setTimeout(() => tick(0), speed);

    return () => {
      // cleanup時に世代を進めて無効化
      genRef.current += 1;
    };
  }, [text, speed]);

  return displayText;
};
