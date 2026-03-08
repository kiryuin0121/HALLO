import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: partsId } = await params;
  // console.log(`GET api/avatar/parts/${partsId}`) //ok
  const parts = await prisma.parts.findFirst({
    where: {
      id: partsId,
    },
  });
  if(!parts){
    return NextResponse.json({error:"partsを取得できませんでした"},{status:404});
  }

  // console.log("parts(api):",parts);//ok
  return NextResponse.json({parts},{status:200});
};
