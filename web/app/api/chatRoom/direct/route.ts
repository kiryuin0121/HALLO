import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const selfId = searchParams.get("selfId");
  const otherId = searchParams.get("otherId");

  if (!selfId || !otherId)
    return NextResponse.json(
      { error: "selfIdまたはotherIdが不足しています" },
      { status: 400 }
    );

  // お互いのチャットルームが存在しているかを検証し、
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

  if (chatRoom) {
    // 既に存在していれば、チャットルームのidを返す
    return NextResponse.json({ roomId: chatRoom.id }, { status: 200 });
  } else {
    // 存在していなければ、新しくチャットルームを作成し、idを返す
    const newChatRoom = await prisma.chatRoom.create({
      select: { id: true },
      data: {
        chatStyle: "direct",
        members: {
          create: [{ memberId: selfId }, { memberId: otherId }],
        },
      },
    });
    return NextResponse.json({ roomId: newChatRoom.id }, { status: 201 });
  }
};
