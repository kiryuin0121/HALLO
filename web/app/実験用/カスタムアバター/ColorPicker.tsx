import {
  avatarConfigAtom,
  changeColorAtom,
  currentCategoryAtom,
} from "@/atoms/avatar";
import { CategoryWithRelations } from "@/types/avatar";
import { useAtomValue, useSetAtom } from "jotai";
import React from "react";

const ColorPicker = () => {
  const setColor = useSetAtom(changeColorAtom);
  const currentCategory = useAtomValue(currentCategoryAtom);
  const avatarConfig = useAtomValue(avatarConfigAtom);

  if (!currentCategory) {
    console.log("currentCategoryが初期化されていません。");
    return null;
  }
  if (!avatarConfig) {
    console.log("avatarConfigが初期化されていません。");
    return null;
  }
  return (
    <div className="pointer-events-auto relative flex gap-2 w-fit max-w-full overflow-x-scroll no-scrollbar backdrop-blur-[2px] py-2 drop-shadow-md noscrollbar px-2 md:px-0">
      {currentCategory.colorPalette &&
        currentCategory.colorPalette.colors.map(
          (color: string, index: number) => (
            <button
              key={`${index}-${color}`}
              className={`w-10 h-10 p-1.5 drop-shadow-md bg-black/20 shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 cursor-pointer
             ${
               avatarConfig[currentCategory.name]?.color === color
                 ? "border-white"
                 : "border-transparent"
             }
          `}
              onClick={() => setColor(color)}
            >
              <div
                className="w-full h-full rounded-md"
                style={{ backgroundColor: color }}
              />
            </button>
          ),
        )}
    </div>
  );
};

export default ColorPicker;
