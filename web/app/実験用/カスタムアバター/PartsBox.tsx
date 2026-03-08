import {
  avatarConfigAtom,
  categoriesAtom,
  changeCurrentCategoryAtom,
  changePartsAtom,
  currentCategoryAtom,
  initAvatarStateAtom,
} from "@/atoms/avatar";
import {  CategoryLabel, CategoryWithRelations } from "@/types/avatar";
import { useAtomValue, useSetAtom } from "jotai";
import  { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const PartsBox = () => {
  const initAvatarState = useSetAtom(initAvatarStateAtom);
  const avatarConfg = useAtomValue(avatarConfigAtom);
  const categories = useAtomValue(categoriesAtom);
  const currentCategory = useAtomValue(currentCategoryAtom);
  const setCurrentCategory = useSetAtom(changeCurrentCategoryAtom);
  const setParts = useSetAtom(changePartsAtom);
  
  useEffect(() => {
    initAvatarState();
  }, [initAvatarState]);

  if (!avatarConfg) {
    console.log("avatarConfigが初期化されていません。");
    return null;
  }
  if (!currentCategory) {
    console.log("currentCategoryが初期化されていません。");
    return null;
  }
  return (
    <div className="rounded-t-lg bg-linear-to-br from-black/30 to-indigo-900/20  backdrop-blur-sm drop-shadow-md py-6 gap-3 flex flex-col">
      <div className="flex items-center gap-8 pointer-events-auto overflow-x-auto px-6 pb-2 no-scrollbar">
        {categories.map((category: CategoryWithRelations) => {
          return (
            <button
              key={category.id}
              onClick={() => setCurrentCategory(category)}
              className={`font-mplus font-medium shrink-0 border-b  cursor-pointer transition-colors duration-250 hover:text-neutral-300  ${
                currentCategory.name === category.name
                  ? "text-white shadow-purple-100 border-b-white"
                  : "text-gray-400 border-b-transparent"
              }`}
            >
              {CategoryLabel[category.name]}
            </button>
          );
        })}
      </div>

      <div className={`flex gap-2 flex-wrap px-6`}>
        {currentCategory.removable && (
          <button
            onClick={() => setParts(null)}
            className={`w-20 h-20 rounded-xl overflow-hidden pointer-events-auto hover:opacity-100 transition-all border-2 duration-300
              ${
                !avatarConfg[currentCategory.name]?.parts
                  ? "border-white opacity-100"
                  : "opacity-80 border-transparent"
              }`}
          >
            <div className="w-full h-full flex items-center justify-center bg-black/40 text-neutral-300">
              <IoClose size={25}/>
            </div>
          </button>
        )}
        {currentCategory.parts.map((part: any, idx: number) => {
          return (
            <button
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
      </div>
    </div>
  );
};

export default PartsBox;
