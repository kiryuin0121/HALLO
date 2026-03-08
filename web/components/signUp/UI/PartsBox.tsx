import {
  avatarConfigAtom,
  categoriesAtom,
  changeCurrentCategoryAtom,
  changePartsAtom,
  currentCategoryAtom,
  initAvatarStateAtom,
} from "@/atoms/avatar";
import { signUpAtom } from "@/atoms/signUp";
import { useVoiceVox } from "@/hooks/useVoiceVox";
import { SPEAKER_LIST } from "@/lib/speakerList";
import { CategoryLabel, CategoryWithRelations } from "@/types/avatar";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { BsVolumeUpFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export const isVoiceModeAtom = atom(false);
const PartsBox = () => {
  const avatarConfg = useAtomValue(avatarConfigAtom);
  const categories = useAtomValue(categoriesAtom);
  const currentCategory = useAtomValue(currentCategoryAtom);
  const setCurrentCategory = useSetAtom(changeCurrentCategoryAtom);
  const setParts = useSetAtom(changePartsAtom);
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const pronounce = useVoiceVox();
  const [isVoiceMode, setIsVoiceMode] = useAtom(isVoiceModeAtom);
  return (
    <div className="rounded-t-lg bg-linear-to-br from-black/30 to-indigo-900/20  backdrop-blur-sm drop-shadow-md py-6 gap-3 flex flex-col">
      {/* 現在のカテゴリ切り替えタブ */}
      <div className="flex items-center gap-8 pointer-events-auto overflow-x-auto px-6 pb-2 no-scrollbar">
        {/* 顔、髪、...、アクセサリー */}
        {categories.map((category: CategoryWithRelations) => {
          return (
            <button
            type="button"
              key={category.id}
              onClick={() => {
                setIsVoiceMode(false);
                setCurrentCategory(category);
              }}
              className={`font-dotgothic font-medium shrink-0 border-b  cursor-pointer transition-colors duration-250 hover:text-neutral-300  ${
                currentCategory?.name === category.name
                  ? "text-white shadow-purple-100 border-b-white"
                  : "text-gray-400 border-b-transparent"
              }`}
            >
              {CategoryLabel[category.name]}
            </button>
          );
        })}
        {/* ボイス */}
        <button
        type="button"
          onClick={() => {
            setIsVoiceMode(true);
            setCurrentCategory(undefined);
          }}
          className={`cursor-pointer font-dotgothic font-medium shrink-0 border-b transition-colors duration-200 ${
            isVoiceMode
              ? "text-white border-b-white"
              : "text-gray-400 border-b-transparent"
          }`}
        >
          ボイス
        </button>
      </div>

      {/* 現在のカテゴリにおけるパーツ一覧 */}
      <div className={`flex gap-2 flex-wrap px-6 pointer-events-auto`}>
        {isVoiceMode ? (
          <>
            {SPEAKER_LIST.map((speaker) => {
              const isSelected = signUp.voice === speaker.id;
             
              return (
                <button
                  type="button"
                  key={speaker.id}
                  onClick={async () => {
                    if (signUp.voice === speaker.id) return;
                    setSignUp((su) => {
                      return { ...su, voice: speaker.id };
                    });
                    console.log("done");
                    await pronounce(
                      `ハロー!学内メタバースハローへようこそ！`,
                      speaker.id,
                      1.1
                    );
                  }}
                  className={`w-20 aspect-square cursor-pointer text-neutral-50 bg-[#212125] rounded-xl border-2 flex flex-col items-center justify-center gap-y-1 transition-all ${
                    isSelected
                      ? "border-white"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* 音量アイコン */}
                  <BsVolumeUpFill size={30} />

                  {/* 上に重ねるラベル */}
                  <span className="text-[10px] px-1">{speaker.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            {currentCategory?.removable && (
              <button
              type="button"
                onClick={() => setParts(null)}
                className={`w-20 h-20 rounded-xl overflow-hidden pointer-events-auto hover:opacity-100 transition-all border-2 duration-300
                ${
                  !avatarConfg[currentCategory.name]?.parts
                    ? "border-white opacity-100"
                    : "opacity-80 border-transparent"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center bg-black/40 text-neutral-300">
                  <IoClose size={25} />
                </div>
              </button>
            )}
            {currentCategory?.parts.map((part: any, idx: number) => {
              return (
                <button
                type="button"
                  key={idx}
                  onClick={() => setParts(part)}
                  className={`w-20 aspect-square rounded-xl overflow-hidden pointer-events-auto border-2 cursor-pointer 
                  ${
                    avatarConfg[currentCategory.name]?.parts?.id === part.id
                      ? "border-white opacity-100"
                      : "opacity-80 border-transparent brightness-90 transition-all duration-250 hover:brightness-95"
                  }
                  `}
                >
                  <img
                    className={`object-cover w-full h-full`}
                    src={part.image}
                    alt={part.name}
                  />
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PartsBox;
