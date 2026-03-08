import { PartsCategory } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { AvatarConfig } from "@/types/avatar";
import { UserWithRelations } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";

const buildAvatarConfig = (
  avatar: NonNullable<UserWithRelations["avatar"]>,
) => {
  // アバターのパーツ装着状態のリスト
  const avatarConfig: AvatarConfig = {};

  // avatarConfigをnullで初期化する
  for (const category of Object.values(PartsCategory)) {
    avatarConfig[category] = {
      parts: null,
      color: null,
    };
  }
  // 装着しているパーツをavatarConfigに登録する
  for (const ap of avatar.avatarParts) {
    const categoryName = ap.parts.category.name;
    avatarConfig[categoryName] = {
      parts: ap.parts,
      color: ap.color,
    };
  }

  return avatarConfig;
};

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  // userIdを取得。
  const { id: userId } = await params;

  //userIdに紐づくユーザーのデータを取得する。(ユーザー+プロフィール+アバター)
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      avatar: {
        include: {
          avatarParts: {
            include: {
              parts: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user || !user.profile || !user.avatar) {
    console.log("ユーザーが見つかりませんでした。");
    return NextResponse.json(
      { error: "ユーザーが見つかりませんでした。" },
      { status: 404 },
    );
  }

  // アバターデータをavatarConfig型へ加工する。
  const avataConfig = buildAvatarConfig(user.avatar);

  // クライアント側へデータを返却する。(ユーザー+プロフィール+アバター)
  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: user.profile,
      avatarConfig: avataConfig,
    },
    {
      status: 200,
    },
  );
};
