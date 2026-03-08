import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  // クエリパラメータからログイン中のユーザー&チャット相手のユーザーIDを取得する。
  const searchParams = request.nextUrl.searchParams;
  const selfId = searchParams.get("selfId");
  const otherId = searchParams.get("otherId");
  if (!selfId || !otherId)
    return NextResponse.json(
      { error: "selfIdまたはotherIdが不足しています" },
      { status: 400 }
    );

  // お互いのチャットルームを検索する。
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      chatStyle: "direct",
      AND: [
        { members: { some: { memberId: selfId } } },
        { members: { some: { memberId: otherId } } },
      ],
    },
    select: { id: true },
  });
  // お互いのチャットルームがすでに存在していれば、チャットルームIDとメッセージ履歴を返す。
  if (chatRoom) {
    const messages = await prisma.message.findMany({
      where: {
        roomId: chatRoom.id,
      },
    });
    return NextResponse.json(
      { roomId: chatRoom.id, messages: messages },
      { status: 200 }
    );
  } else {
    // 存在していなければ、チャットルームを新しく作成し,チャットルームIDと空のメッセージ履歴を返す。
    const newChatRoom = await prisma.chatRoom.create({
      select: { id: true },
      data: {
        chatStyle: "direct",
        members: {
          create: [{ memberId: selfId }, { memberId: otherId }],
        },
      },
    });
    return NextResponse.json(
      { roomId: newChatRoom.id, messages: [] },
      { status: 201 }
    );
  }
};
