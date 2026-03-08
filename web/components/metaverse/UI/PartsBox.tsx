"use client";

import {
  avatarConfigAtom,
  categoriesAtom,
  changeCurrentCategoryAtom,
  changePartsAtom,
  currentCategoryAtom,
  myProfileAtom,
  updateMyProfileFieldAtom,
} from "@/atoms/myProfile";
import { CategoryLabel, CategoryWithRelations } from "@/types/avatar";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { IoClose } from "react-icons/io5";
import { useVoiceVox } from "@/hooks/useVoiceVox";
import { BsVolumeUpFill } from "react-icons/bs";
import { SPEAKER_LIST } from "@/lib/speakerList";

export const isVoiceModeAtom = atom(false);
const PartsBox = () => {
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const categories = useAtomValue(categoriesAtom);
  const currentCategory = useAtomValue(currentCategoryAtom);
  const setCurrentCategory = useSetAtom(changeCurrentCategoryAtom);
  const setParts = useSetAtom(changePartsAtom);

  const myProfile = useAtomValue(myProfileAtom);
  const updateField = useSetAtom(updateMyProfileFieldAtom);

  const pronounce = useVoiceVox();
  const [isVoiceMode, setIsVoiceMode] = useAtom(isVoiceModeAtom);

  if (!avatarConfig || !currentCategory) return null;

  return (
    <div className="rounded-t-lg bg-linear-to-br from-black/30 to-indigo-900/20 backdrop-blur-sm drop-shadow-md py-6 gap-3 flex flex-col">
      {/* 現在のカテゴリ切り替えタブ */}
      <div className="flex items-center gap-8 pointer-events-auto overflow-x-auto px-6 pb-2 no-scrollbar">
        {categories.map((category: CategoryWithRelations) => (
          <button
            key={category.id}
            onClick={() => {
              setIsVoiceMode(false);
              setCurrentCategory(category);
            }}
            className={`cursor-pointer font-dotgothic font-medium shrink-0 border-b transition-colors duration-200 ${
              !isVoiceMode && currentCategory.name === category.name
                ? "text-white border-b-white"
                : "text-gray-400 border-b-transparent"
            }`}
          >
            {CategoryLabel[category.name]}
          </button>
        ))}

        <button
          onClick={() => {
            setIsVoiceMode(true)
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
      <div className="flex gap-2 flex-wrap px-6">
        {isVoiceMode ? (
          <>
            {SPEAKER_LIST.map((speaker) => {
              const isSelected = myProfile.voice === speaker.id;
              return (
                <button
                  key={speaker.id}
                  onClick={async () => {
                    if (myProfile.voice === speaker.id) return;

                    updateField({ voice: speaker.id });
                    await pronounce(
                      "てすてす。これはサンプル音声です。",
                      speaker.id,
                      1.1,
                    );
                  }}
                  className={`w-20 aspect-square cursor-pointer bg-[#212125] rounded-xl border-2 flex flex-col items-center justify-center gap-y-1 transition-all ${
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
            {currentCategory.removable && (
              <button
                onClick={() => setParts(null)}
                className={`w-20 aspect-square cursor-pointer rounded-xl overflow-hidden pointer-events-auto border-2 transition-all duration-200 ${
                  !avatarConfig[currentCategory.name]?.parts
                    ? "border-white"
                    : "border-transparent opacity-80"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center bg-black/40 text-neutral-300">
                  <IoClose size={30} />
                </div>
              </button>
            )}

            {currentCategory.parts.map((part: any) => (
              <button
                key={part.id}
                onClick={() => setParts(part)}
                className={`w-20 aspect-square cursor-pointer rounded-xl overflow-hidden pointer-events-auto border-2 transition-all duration-200 ${
                  avatarConfig[currentCategory.name]?.parts?.id === part.id
                    ? "border-white"
                    : "border-transparent opacity-80"
                }`}
              >
                <img
                  className="object-cover w-full h-full"
                  src={part.image}
                  alt={part.name}
                />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PartsBox;
