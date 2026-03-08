"use client";

import { sequenceNumAtom, signUpAtom, signUpStepAtom } from "@/atoms/signUp";
import { useAtom, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { signUpSchema } from "@/schemas/auth";

const TEXT_CONFIG = {
  name: {
    placeholder: "名前を入力...",
    question: "名前をおしえてください",
  },
  hometown: {
    placeholder: "例：岡山県",
    question: "出身地をおしえてください",
  },
  bio: {
    placeholder: "ひと言を入力...",
    question: "何かひと言入力してください",
  },
} as const;

type Props = {
  field: "name" | "hometown" | "bio";
};

const InputText = ({ field }: Props) => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const [inputTxt, setInputTxt] = useState<string>(
    (signUp[field] as string) ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSequenceNumAtom = useSetAtom(sequenceNumAtom);
  const [signUpStep, setSignUpStep] = useAtom(signUpStepAtom);
  const { placeholder, question } = TEXT_CONFIG[field];

  const handleDetermine = () => {
    const result = signUpSchema.shape[field].safeParse(inputTxt);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setSignUp((prev) => ({ ...prev, [field]: result.data }));
    setSequenceNumAtom((prev) => prev + 1);

    field === "bio" && setSignUpStep("confirm");
  };

  return (
    <div
      className={`h-screen w-screen flex justify-center items-center font-dotgothic`}
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => inputRef.current?.focus()}
        className={`relative w-full max-w-2xl aspect-video bg-black border-2 border-neutral-800 p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto`}
      >
        <div className={`text-neutral-500 text-sm mb-4 break-all`}>
          <p className={`leading-relaxed`}>
            Q:\HALLO\SIGN_UP\{signUpStep.toUpperCase()}\{field.toUpperCase()}
            {">"}
            <span className={`text-neutral-200 ml-2`}>{question}</span>
          </p>
        </div>

        <div className={`flex-1 flex flex-col justify-center items-start`}>
          <div className={`w-fit flex items-center py-2 space-x-3`}>
            <span className={`text-neutral-500 text-sm whitespace-nowrap`}>
              A:\HALLO\{signUp.name ? signUp.name : "GUEST"}
              {">"}
            </span>
            <input
              type="text"
              ref={inputRef}
              autoFocus
              className={`
                min-w-50 bg-transparent outline-none text-neutral-50 placeholder:text-neutral-800
                ${error ? "border-b-2 border-red-500" : ""}
              `}
              value={inputTxt}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDetermine();
                }
              }}
              onChange={(e) => {
                // console.log(e.target.value);
                setInputTxt(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className={`h-8 mt-2`}>
            {error && (
              <p className={`text-red-500 text-xs `}>
                [!] VALIDATION_ERROR: {error}
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex justify-between items-end text-[10px] text-neutral-600 tracking-tighter`}
        >
          <div className={`flex items-center space-x-2`}>
            <span
              className={`inline-block w-2 h-2 ${error ? "bg-yellow-500" : "bg-emerald-500"} rounded-full`}
            />
            <span>
              {error ? "SYSTEM_INREADY" : "SYSTEM_READY"}:{" "}
              {error ? "VALIDATION_ERROR" : "WAITING_FOR_USER_INPUT"}
            </span>
          </div>
          <div className={`text-right leading-none`}>
            <p className={`text-neutral-500 mb-1`}>Press [Enter] to Execute</p>
            <p className={`opacity-30 uppercase`}>HALLO_v1.2.1</p>
          </div>
        </div>

        <div
          className={`absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]`}
        ></div>
      </motion.section>
    </div>
  );
};

export default InputText;