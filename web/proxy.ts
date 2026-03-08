import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // アクセス先を取得
  const { pathname } = request.nextUrl;

  // リクエストのHedder部分を確認し、セッション情報を取得
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  //未認証のユーザーをメタバース空間にアクセスさせない。
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/metaverse"],
};
