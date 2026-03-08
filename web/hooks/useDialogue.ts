
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useDialogue = (lines: string[], url?: string) => {
  const [lineIdx, setLineIdx] = useState(0);
  const handleNextLine = () => {
    setLineIdx((index) => (index < lines.length - 1 ? index + 1 : lines.length));
  };
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;
      if (key === "Enter") {
        if (lineIdx < lines.length - 1) {
          handleNextLine();
        } else if (url && lineIdx === lines.length - 1) {
          router.push(url);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lineIdx, lines.length, router, url]);

  return {
    line: lines[lineIdx],
    lineIdx,
    isLastLine: lineIdx === lines.length - 1,
    handleNextLine,
  };
};
