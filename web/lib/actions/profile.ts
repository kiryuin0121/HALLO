"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AvatarConfig } from "@/types/avatar";
import { PartsCategory } from "@/generated/prisma/client";
import prisma from "../prisma";

export type SaveAllResult = {
  success: boolean;
  error: string;
};

// プロフィール情報とアバター設定をまとめてDBに保存するServer Action
// saveAllAction.bind(null, avatarConfig) で部分適用してからuseActionStateに渡す
export const saveAllAction = async (
  avatarConfig: AvatarConfig,
  _prev: SaveAllResult,
  formData: FormData,
): Promise<SaveAllResult> => {
  // セッションからログイン中のユーザーIDを取得する
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "未認証です" };
  }

  const userId = session.user.id;

  // formDataからプロフィールの各フィールドを取り出す
  const name = formData.get("name") as string;
  const campus = formData.get("campus") as string;
  const major = formData.get("major") as string;
  const grade = Number(formData.get("grade"));
  const gender = formData.get("gender") as string;
  const mbti = formData.get("mbti") as string;
  const bio = formData.get("bio") as string;
  const voice = Number(formData.get("voice"));
  const hometown = formData.get("hometown") as string;

  try {
    // ユーザー名を更新する
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // プロフィール情報を更新する
    await prisma.profile.update({
      where: { userId },
      data: {
        campus: campus as any,
        major: major as any,
        grade,
        gender: gender as any,
        mbti: mbti as any,
        bio,
        voice,
        hometown
      },
    });

    // アバターレコードを取得する
    const avatar = await prisma.avatar.findUnique({ where: { userId } });

    if (avatar) {
      // 既存のパーツ設定を全削除して最新のavatarConfigで上書きする
      await prisma.avatarParts.deleteMany({ where: { avatarId: avatar.id } });

      // partsが存在するカテゴリのみ保存対象とする
      const validEntries = (
        Object.entries(avatarConfig) as [PartsCategory, AvatarConfig[PartsCategory]][]
      ).filter(([, value]) => value?.parts?.id != null);

      if (validEntries.length > 0) {
        await prisma.avatarParts.createMany({
          data: validEntries.map(([, value]) => ({
            avatarId: avatar.id,
            partsId: value!.parts!.id,
            color: value?.color ?? null,
          })),
        });
      }
    }

    return { success: true, error: "" };
  } catch (error) {
    console.error("saveAllAction error:", error);
    return { success: false, error: "更新に失敗しました" };
  }
};