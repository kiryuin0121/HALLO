"use client";

import { sequenceNumAtom, signUpAtom, signUpStepAtom } from "@/atoms/signUp";
import { useAtom, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { signUpSchema } from "@/schemas/auth";
import { CampusLabel, MajorLabel, GenderLabel } from "@/types/profile";
import { GenderValues, MajorValues } from "@/types/prisma";

const SELECT_CONFIG = {
  campus: {
    question: "学校をおしえてください",
    options: ["osaka", "tokyo", "nagoya"] as const,
    labelMap: CampusLabel,
  },
  major: {
    question: "専攻をおしえてください",
    options: MajorValues,
    labelMap: MajorLabel,
  },
  grade: {
    question: "学年をおしえてください",
    options: [1, 2, 3, 4] as const,
    labelMap: {
      1: "1年",
      2: "2年",
      3: "3年",
      4: "4年",
    } as const,
  },
  gender: {
    question: "性別をおしえてください",
    options: GenderValues,
    labelMap: GenderLabel,
  },
} as const;

type Props = {
  field: "campus" | "major" | "grade" | "gender";
};

const SelectOption = ({ field }: Props) => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const setSequenceNumAtom = useSetAtom(sequenceNumAtom);
  const [signUpStep,setSignUpStep]=useAtom(signUpStepAtom);

  const { question, options, labelMap } = SELECT_CONFIG[field];

  const defaultIndex = options.findIndex((v) => v === signUp[field]);
  const [cursor, setCursor] = useState<number>(
    defaultIndex >= 0 ? defaultIndex : 0,
  );

  const [error, setError] = useState<string | null>(null);

  const handleDetermine = () => {
    const selectedValue = options[cursor];

    const result = signUpSchema.shape[field].safeParse(selectedValue);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);

    setSignUp((prev) => ({
      ...prev,
      [field]: result.data,
    }));

    setSequenceNumAtom((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === "ArrowUp") {
        setCursor((prev) => (prev === 0 ? options.length - 1 : prev - 1));
      }

      if (e.code === "ArrowDown") {
        setCursor((prev) => (prev === options.length - 1 ? 0 : prev + 1));
      }

      if (e.code === "Enter") {
        handleDetermine();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursor]);

  return (
    <div className="h-screen w-screen flex justify-center items-center font-dotgothic">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl aspect-video bg-black border-2 border-neutral-800 p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Question */}
        <div className="text-neutral-500 text-sm mb-4 break-all">
          <p className="leading-relaxed">
            Q:\HALLO\SIGN_UP\{signUpStep.toUpperCase()}\{field.toUpperCase()}
            {">"}
            <span className="text-neutral-200 ml-2">{question}</span>
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center items-start space-y-2">
          <div className="text-neutral-500 text-sm whitespace-nowrap mb-4">
            A:\HALLO\{signUp.name ? signUp.name : "GUEST"}
            {">"}
          </div>

          <ul className={`ml-4`}>
            {options.map((option, idx) => {
              const isActive = cursor === idx;
              return (
                <li
                  key={String(option)}
                  className="flex items-center px-2 py-1"
                >
                  {/* 矢印用固定幅（常に確保） */}
                  <span className="inline-block w-6 text-neutral-100">
                    {isActive ? "▶" : ""}
                  </span>

                  {/* ラベル */}
                  <span
                    className={`
          transition-colors duration-150
          ${isActive ? "text-neutral-100" : "text-neutral-700"}
        `}
                  >
                    {labelMap[option as keyof typeof labelMap]}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="h-8 mt-2">
            {error && (
              <p className="text-red-500 text-xs">
                [!] VALIDATION_ERROR: {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end text-[10px] text-neutral-600 tracking-tighter">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block w-2 h-2 ${
                error ? "bg-yellow-500" : "bg-emerald-500"
              } rounded-full`}
            />
            <span>
              {error
                ? "SYSTEM_INREADY: VALIDATION_ERROR"
                : "SYSTEM_READY: WAITING_FOR_USER_SELECTION"}
            </span>
          </div>

          <div className="text-right leading-none">
            <p className="text-neutral-500 mb-1">
              Use [↑ ↓] to Navigate / Press [Enter] to Execute
            </p>
            <p className="opacity-30 uppercase">HALLO_v1.2.1</p>
          </div>
        </div>

        {/* CRT Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
      </motion.section>
    </div>
  );
};

export default SelectOption;
