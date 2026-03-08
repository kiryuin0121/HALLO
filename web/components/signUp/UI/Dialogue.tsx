"use client";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;

  speaker?: string;

  onClick?: () => void;
};
const Dialogue = ({
  children,
  speaker,
  onClick,
}: Props) => {
  const text = typeof children === "string" ? children : "";
  const displayText = useTypewriter(text, 50);
  return (
    <div className={`mb-24`}>
      <p
        className={`text-neutral-50 p-4 min-w-[50vw] font-dotgothic text-center bg-black/75 text-lg pointer-events-auto`}
      >
        {displayText.map((character, idx) => {
          return (
            <motion.span key={idx} className="inline-block">
              {character === " " ? "\u00A0" : character}
            </motion.span>
          );
        })}
      </p>
    </div>
  );
};

export default Dialogue;


