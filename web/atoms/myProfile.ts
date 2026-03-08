import {
  Campus,
  Gender,
  Major,
  MBTI,
  Profile,
  User,
} from "@/generated/prisma/client";
import { fetchCategories } from "@/lib/api/avatar";
import { AvatarConfig, CategoryWithRelations } from "@/types/avatar";
// Parts.tsxは@/atoms/avatarのskinMaterialAtomを参照しているため、
// myProfile.tsでも同じインスタンスをimportして使うことで皮膚色の変更を反映させる
import { skinMaterialAtom } from "@/atoms/avatar";
import { atom } from "jotai";

// ------カスタムアバター関連-----

// カテゴリ一覧 (head, hair, eyes, ...) を保持するatom
export const categoriesAtom = atom<CategoryWithRelations[]>([]);

// 現在UIで編集中のカテゴリを保持するatom
export const currentCategoryAtom = atom<CategoryWithRelations | undefined>(
  undefined,
);

// 現在のアバターのパーツ装着状態を保持するatom(装着しているorしていない。装着している場合、そのパーツは何色かをリストで管理する。)
export const avatarConfigAtom = atom<AvatarConfig>({});

// 皮膚
export { skinMaterialAtom };

// アバター初期化処理: DBからカテゴリ一覧を取得しatomにセットする
// DBに保存された初期肌色をskinMaterialAtomにも反映する
export const initAvatarStateAtom = atom(
  null,
  async (_, set, currentAvatarConfig: AvatarConfig) => {
    const categories = (await fetchCategories()) as CategoryWithRelations[];
    set(categoriesAtom, categories);
    set(currentCategoryAtom, categories[0]);
    set(avatarConfigAtom, currentAvatarConfig);
  },
);

//パーツの色を変更する
export const changeColorAtom = atom(null, (get, set, color: string) => {
  const currentCategory = get(currentCategoryAtom) as CategoryWithRelations;
  const avatarConfig = get(avatarConfigAtom);

  // avatarConfigに登録されているパーツの色を更新する
  set(avatarConfigAtom, {
    ...avatarConfig,
    [currentCategory.name]: {
      ...avatarConfig[currentCategory.name],
      color,
    },
  });

  // 頭の色と体の色を同期させる。
  if (currentCategory.name === "head") {
    const skin = get(skinMaterialAtom);
    skin.color.set(color);
  }
});

// 装着しているパーツを変更する（nullで非装着）
export const changePartsAtom = atom(
  null,
  (get, set, parts: CategoryWithRelations["parts"][number] | null) => {
    const currentCategory = get(currentCategoryAtom) as CategoryWithRelations;
    const avatarConfig = get(avatarConfigAtom);

    // avatarConfigに登録しているパーツを更新する。
    set(avatarConfigAtom, {
      ...avatarConfig,
      [currentCategory.name]: {
        ...avatarConfig[currentCategory.name],
        parts,
      },
    });
  },
);

// 編集中のカテゴリを切り替える
export const changeCurrentCategoryAtom = atom(
  null,
  (_, set, category: CategoryWithRelations) => {
    set(currentCategoryAtom, category);
  },
);

// -----ユーザープロフィール関連------

// フォームの状態の型
export type FormState = {
  name: string;
  campus: Campus;
  major: Major;
  grade: number;
  gender: Gender;
  mbti: MBTI;
  bio: string;
  voice:number;
  hometown:string;
};

// プロフィールフォームの状態を保持するatom
export const myProfileAtom = atom<FormState>({
  name: "",
  campus: "osaka",
  major: "it_web_ai",
  grade: 1,
  gender: "male",
  mbti: "INFJ",
  bio: "",
  voice:3,
  hometown:"未設定"
});

// フォームの特定フィールドを部分更新するatom
export const updateMyProfileFieldAtom = atom(
  null,
  (get, set, field: Partial<FormState>) => {
    set(myProfileAtom, { ...get(myProfileAtom), ...field });
  },
);

// ページ初期表示時にDBから取得したデータをatomに反映する
type UserData = {
  user: User;
  profile: Profile;
  avatarConfig: AvatarConfig;
};

export const initMyProfileAtom = atom(null, (_, set, userData: UserData) => {
  const { user, profile } = userData;
  set(myProfileAtom, {
    name: user.name,
    campus: profile.campus,
    major: profile.major,
    grade: profile.grade,
    gender: profile.gender,
    mbti: profile.mbti,
    bio: profile.bio,
    voice:profile.voice,
    hometown:profile.hometown
  });
});

export type EditState = "profile" | "avatar" | null;
export const editStateAtom = atom<EditState>(null);
