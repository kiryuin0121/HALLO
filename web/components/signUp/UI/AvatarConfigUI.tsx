// 
"use client";
import { avatarConfigAtom, currentCategoryAtom } from "@/atoms/avatar";
import { CategoryWithRelations } from "@/types/avatar";
import { useAtomValue, useSetAtom } from "jotai";
import { sequenceNumAtom, signUpAtom, signUpStepAtom } from "@/atoms/signUp";
import PartsBox from "./PartsBox";
import ColorPicker from "./ColorPicker";

const AvatarConfigUI = () => {
  const currentCategory = useAtomValue(
    currentCategoryAtom,
  ) as CategoryWithRelations;
  const avatarConfg = useAtomValue(avatarConfigAtom);
  if (!avatarConfg) {
    return null;
  }
  const setSequenceNum = useSetAtom(sequenceNumAtom);
  const setSignUp = useSetAtom(signUpAtom);
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const setSignUpStep = useSetAtom(signUpStepAtom);
  const handleClick = () => {
    const avatarConfigStr = JSON.stringify(avatarConfig);
    setSignUp((formState) => {
      return {
        ...formState,
        avatarConfig: avatarConfigStr,
      };
    });
    setSequenceNum((sn) => sn + 1);
    setSignUpStep("account");
  };

  return (
    <main className="absolute inset-8 pointer-events-none z-10 select-none">
      <div className="mx-auto h-full max-w-screen w-full flex flex-col justify-between">

        {/* ヘッダー */}
        <div className="flex justify-between items-center p-10">
          <h2 className="font-dotgothic text-neutral-500 tracking-wide leading-relaxed">
            Q:\HALLO\SIGN_UP\AVATAR{">"}
            <span className="text-neutral-100 ml-2 text-lg">アバターを設定してください</span>
          </h2>

          {/* 確定ボタン */}
          <button
            type="button"
            onClick={handleClick}
            className="pointer-events-auto cursor-pointer font-dotgothic tracking-widest text-amber-300 text-sm px-5 py-2 border border-amber-500/50 hover:border-amber-400 hover:text-amber-200 hover:shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-all duration-200 flex items-center gap-x-2.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            [設定完了]
          </button>
        </div>

        {/* ボトム：カラーピッカー + パーツ */}
        <div className="px-10 flex flex-col">
          {currentCategory && avatarConfg[currentCategory.name] && (
            <ColorPicker />
          )}
          <PartsBox />
        </div>

      </div>
    </main>
  );
};

export default AvatarConfigUI;