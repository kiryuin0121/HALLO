"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  Campus,
  Gender,
  Major,
  MBTI,
  PartsCategory,
} from "@/generated/prisma/enums";
import { AvatarConfig } from "@/types/avatar";
import { signUpSchema } from "@/schemas/auth";

type ActionState = {
  error: string;
  success: boolean;
};
// ユーザー新規登録
export const signUpAction = async (
  _: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  let userId: string = "";
  try {
    // フォームデータを取得する。
    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      campus: formData.get("campus") as Campus,
      major: formData.get("major") as Major,
      grade: Number(formData.get("grade")),
      gender: formData.get("gender") as Gender,
      mbti: formData.get("mbti") as MBTI,
      bio: formData.get("bio") as string,
      voice: Number(formData.get("voice")),
      hometown: formData.get("hometown") as string,
    };

    // バリデーションを行う。
    const parsedResult = signUpSchema.safeParse(rawFormData);
    if (!parsedResult.success) {
      const varidationError =
        parsedResult.error.issues[0]?.message ??
        "不適切な入力項目が存在します。";
      return { success: false, error: varidationError };
    }

    const {
      name,
      email,
      password,
      campus,
      major,
      grade,
      gender,
      mbti,
      bio,
      voice,
      hometown,
    } = parsedResult.data;

    const rawAvatarConfig = formData.get("avatarConfig") as string;
    const avatarConfig: AvatarConfig = JSON.parse(rawAvatarConfig);

    // ユーザーを作成する(betterAuthの新規登録関数を呼ぶ)
    const { user } = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    userId = user.id;
    // ほかの項目を新規ユーザーに紐づけながら作成する。
    await prisma.$transaction(async (prisma) => {

      // 新規ユーザーのプロフィールを作成
      await prisma.profile.create({
        data: { userId, campus, major, grade, gender, mbti, bio, voice,hometown },
      });

      // 新規ユーザーのアバターを作成
      const avatar = await prisma.avatar.create({ data: { userId } });
      const avatarId = avatar.id;

      // 作成したアバターが装着しているパーツを作成
      for (const categoryName of Object.keys(avatarConfig) as PartsCategory[]) {
        const avatarConfigValue = avatarConfig[categoryName]; //カテゴリごとのパーツ着用状況(パーツを装着している？しているならばどのパーツ？そしてそれは何色？みたいな情報が入っている)

        // カテゴリに対してパーツが装着されていれば、パーツをアバターに紐づけて作成する。装着していない場合は、次のカテゴリへ進む。
        const parts = avatarConfigValue?.parts;
        if (!parts) continue;

        await prisma.avatarParts.create({
          data: {
            avatarId,
            partsId: parts.id,
            color: avatarConfigValue.color,
          },
        });
      }
    });
  } catch (e) {
    // トランザクションのロールバック処理
    if (userId !== "") {
      // 新規ユーザーに対して他項目データを紐づける処理ところでミスった場合、新規ユーザーを削除し、何もなかったことにする
      await prisma.user.delete({ where: { id: userId } });
    }
    console.error(e);
    return { success: false, error: "新規登録処理に失敗しました" };
  }

  // 新規登録処理に成功した場合、メタバース空間へリダイレクトする。
  redirect("/metaverse");
};

// ログイン認証
export const signInAction = async (_: ActionState, formData: FormData) => {
  try {
    // email,passwordを取得
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // ログイン処理(betterAuthのログイン関数を呼ぶ)
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error) {
    console.error(error);
    return { success: false, error: "メールアドレスまたはパスワードが間違っています。" };
  }

  // ログイン処理に成功した場合、メタバース空間へリダイレクトする。
  redirect("/metaverse");
};

// ログアウト処理
export const signOutAction = async () => {
  auth.api.signOut({ headers: await headers() });
  redirect("/");
};
