import { Category, Parts, PartsCategory } from "@/generated/prisma/client";
import { fetchCategories, fetchDefaultParts } from "@/lib/api/avatar";
import {
  AvatarConfig,
  AvatarConfigValue,
  CategoryWithRelations,
} from "@/types/avatar";
import { atom } from "jotai";
import { MeshStandardMaterial } from "three";

export const categoriesAtom = atom<CategoryWithRelations[]>([]); //カテゴリ一覧(head,hair,eyes,...)
export const currentCategoryAtom = atom<CategoryWithRelations|undefined>(); //現在UI上で編集しているカテゴリ
export const avatarConfigAtom = atom<AvatarConfig>({}); //現在のアバターの編集状況(パーツ・色の状態)

export const skinMaterialAtom = atom(
  new MeshStandardMaterial({ color: 0xffdfc4, roughness: 1 }),
); //肌の色のマテリアル(顔の色と体の皮膚の色を同期させる)

// 初期ロード処理
export const initAvatarStateAtom = atom(null, async (_, set) => {
  // データをDBから取得する
  const categories = (await fetchCategories()) as CategoryWithRelations[];

  // avatarConfig初期状態を設定する
  const avatarConfig: AvatarConfig = {};
  for (const category of categories) {
    avatarConfig[category.name] = {
      parts: category.defaultPartsId
        ? await fetchDefaultParts(category.defaultPartsId)
        : null, //初期パーツ
      color: category.colorPalette?.colors?.[0] ?? null, //初期カラー
    };
  }

  // globalStateに保持する
  set(categoriesAtom, categories);
  set(currentCategoryAtom, categories[0]);
  set(avatarConfigAtom, avatarConfig);
});

//色を変更
export const changeColorAtom = atom(null, (get, set, color: string) => {
  const currentCategory = get(currentCategoryAtom) as Category;
  const avatarConfig = get(avatarConfigAtom);

  // avatarConfigのパーツの色を上書きする
  set(avatarConfigAtom, {
    ...avatarConfig,
    [currentCategory.name]: {
      ...avatarConfig[currentCategory.name],
      color,
    },
  });

  if (currentCategory.name === "head") {
    const skin = get(skinMaterialAtom);
    skin.color.set(color);
  }
});

// パーツを変更
export const changePartsAtom = atom(null, (get, set, parts) => {
  const currentCategory = get(currentCategoryAtom) as Category;
  const avatarConfig = get(avatarConfigAtom);

  // avatarConfigのパーツのモデルを上書きする
  set(avatarConfigAtom, {
    ...avatarConfig,
    [currentCategory.name]: {
      ...avatarConfig[currentCategory.name],
      parts,
    },
  });
});

// 編集中のカテゴリを変更
export const changeCurrentCategoryAtom = atom(
  null,
  (_, set, category: CategoryWithRelations|undefined) => {
    set(currentCategoryAtom, category);
  },
);

