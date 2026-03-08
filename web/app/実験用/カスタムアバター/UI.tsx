"use client";
import {
  avatarConfigAtom,
  currentCategoryAtom,
} from "@/atoms/avatar";
import { CategoryWithRelations } from "@/types/avatar";
import { useAtom, useAtomValue } from "jotai";

import ColorPicker from "./ColorPicker";
import PartsBox from "./PartsBox";
import { signUpAtom } from "@/atoms/signUp";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "../page";
const DownLoadButton = () => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  // const downloadAvatarConfig = useAtomValue(downloadAvatarConfigAtom);
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const router = useRouter();
  if (!avatarConfig) {
    console.log("avatarConfigが初期化されていません。");
    return null;
  }
  const handleNext = () => {
    console.log("avatarConfig:", avatarConfig);
    const avatarConfigStr = JSON.stringify(avatarConfig);
    console.log(avatarConfigStr);
    setSignUp((formState) => {
      return {
        ...formState,
        avatarConfig:avatarConfigStr,
      };
    });
    router.push(`${BASE_PATH}/step4`);
  };
  return (
    <button
      type="button"
      className="font-mplus font-semibold  pointer-events-auto rounded-xl tracking-wide bg-indigo-500 text-white px-6 py-3 cursor-pointer duration-250 hover:bg-indigo-600"
      onClick={handleNext}
    >
      けってい！
    </button>
  );
};

const UI = () => {
  const currentCategory = useAtomValue(
    currentCategoryAtom,
  ) as CategoryWithRelations;
  const avatarConfg = useAtomValue(avatarConfigAtom);
  if (!currentCategory || !avatarConfg) {
    return null;
  }

  return (
    <main className="pointer-events-none fixed z-10 inset-8 select-none">
      <div className="mx-auto h-full max-w-screen w-full flex flex-col justify-between">
        <div className=" flex justify-between items-center p-10">
          <h1 className={`text-xl font-bold text-neutral-50 font-mplus tracking-wide`}>
            STEP3:アバターを設定しよう
          </h1>
          <DownLoadButton />
        </div>
        <div className="px-10 flex flex-col ">
          {currentCategory.colorPalette &&
            avatarConfg[currentCategory.name] && <ColorPicker />}
          <PartsBox />
        </div>
      </div>
    </main>
  );
};

export default UI;
