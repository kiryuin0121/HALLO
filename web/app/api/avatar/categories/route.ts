import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest) => {
  // console.log("GET api/avatar/categories") //ok
  const categories = await prisma.category.findMany({
    orderBy: { serial: "asc" },
    include: {
      parts: { orderBy: { createdAt: "desc" } },
      defaultParts: true,
      colorPalette: true,
    },
  });
  if (!categories) {
    console.error("categoriesを取得できませんでした");
    NextResponse.json(
      { error: "categoriesを取得できませんでした" },
      { status: 404 },
    );
  }

  // console.log("categories",categories);//ok
  return NextResponse.json({ categories }, { status: 200 });
};
