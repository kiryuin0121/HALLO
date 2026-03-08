import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  // UserIdを取得する。
  const { id: userId } = await params;

  // user情報を取得する。
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

  // クライアントへuser情報を返却する。
  if (!user) {
    console.log("user情報の取得に失敗しました。");
    return NextResponse.json(
      { error: "user情報の取得に失敗しました" },
      { status: 404 },
    );
  }

  return NextResponse.json({ user }, { status: 200 });
};
