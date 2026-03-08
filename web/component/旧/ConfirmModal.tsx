"use client";
import { signUpAtom } from "@/atoms/signUp";
import { atom, useAtom, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  content: string;
  fill?: string;
  stroke?: string;
  modalClassName?: string;
  url?: string;
  onClick?: () => void;
};
export const modalAtom = atom(false
);
const confirmOptions = [
  { status: "NG", label: "考えなおす" },
  { status: "OK", label: "おっけー！" },
];

const ConfirmModal = ({
  content,
  fill = "#171717",
  stroke = "#262626",
  modalClassName = "relative",
  url,
  onClick,
}: Props) => {
  const [optIdx, setOptIdx] = useState(0);
  const [showModal, setShowModal] = useAtom(modalAtom);
  const setSignUp = useSetAtom(signUpAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;
      switch (key) {
        case "ArrowRight":
          setOptIdx((idx) => (idx + 1) % confirmOptions.length);
          break;
        case "ArrowLeft":
          setOptIdx(
            (idx) => (idx - 1 + confirmOptions.length) % confirmOptions.length,
          );
          break;
        case "Enter":
          const {status}=confirmOptions[optIdx];
          switch(status){
            case "OK":
              setSignUp((formState) => ({ ...formState, name:content }));
              router.push(url||pathname);
              setShowModal(false);
              break;
            case "NG":
              setShowModal(false);
              break;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 
  return (
    <>
      {showModal && (
        <div
          className={`bg-black/0 w-4xl aspect-3/2 ${modalClassName}`}
          onClick={onClick}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 340"
            preserveAspectRatio="none"
          >
            <motion.path
              fill={fill}
              stroke={stroke}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 200 80 C 250 70, 350 70, 400 80 Q 455 85, 495 105 C 515 115, 530 128, 530 145 C 530 158, 535 172, 545 185 C 553 195, 553 205, 545 215 C 537 225, 515 245, 460 265 C 410 275, 190 275, 140 265 C 100 250, 75 235, 65 220 C 53 206, 53 198, 55 185 C 57 172, 52 158, 50 150 C 35 133, 35 115, 45 105 Q 55 85, 110 80 C 140 77, 170 78, 200 80 Z"
            />
          </svg>

          <div className="absolute inset-0 bg-red-500/0">
            <div
              className={`absolute top-40 left-1/2 -translate-x-1/2 w-124 h-4/10 border border-red-500/0 flex items-center justify-center overflow-hidden`}
            >
              <p className={`font-mplus text-2xl`}>
                <span className={`font-semibold text-indigo-500 mx-1`}>
                  {content}
                </span>
                さんでよろしいですか？
              </p>
            </div>
            <ul className="absolute left-1/2 bottom-36 -translate-x-1/2 flex gap-x-6 justify-center">
              {confirmOptions.map((opt, idx) => {
                return (
                  <li key={opt.status}>
                    <button
                      // onClick={() => setOptIdx(idx)}
                      onClick={() => {
    const status = confirmOptions[optIdx].status;
    if(status === "OK"){
      setSignUp((formState) => ({ ...formState, name: content }));
      router.push(url || pathname);
    }
    setShowModal(false);
  }}
                      className={`
                    font-mplus px-6 py-3 rounded-4xl border-2 border-neutral-700 cursor-pointer font-bold transition-all
              text-neutral-400
                    ${idx === optIdx ? "bg-indigo-500" : "text-neutral-800"}
                    `}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
