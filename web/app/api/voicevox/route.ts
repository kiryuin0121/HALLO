import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // POSTリクエストのbody部分から、話す文章と誰のボイスで話すのかを表す番号を取得する。
  const { text, speaker ,speed} = await req.json();
    console.log("speed:", speed,"speaker:",speaker);
  // voiceVoxAPIにリクエストを投げる。
  const url =
    `https://deprecatedapis.tts.quest/v2/voicevox/audio/` +
    `?key=${process.env.VOICEVOX_API_KEY}` +
    `&speaker=${speaker??3}` +
    `&pitch=0` +
    `&intonationScale=1` +
    `&speed=${speed??1}` +
    `&text=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json(
      { error: "ボイスの生成に失敗しました" },
      { status: 500 },
    );
  }

  // 音声データをNode.js&ブラウザの両方で扱える形式(buffer)に変換して返却する。
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
};
