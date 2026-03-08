"use client";

import Link from "next/link";


const Scanlines = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
    }}
  />
);


const TopUI = () => {
  return (
    <>
      <Scanlines />

      {/* メインコンテンツ */}
      <div className="w-screen h-screen flex flex-col justify-center items-center gap-6 pointer-events-none">
        {/* サブタイトル */}
        <p className="font-mono text-sm tracking-[0.4em] text-green-400/70">
          HAL東京/名古屋/大阪 専用メタバース
        </p>

        {/* メインタイトル */}
        <h1
          className="font-extrabold leading-none select-none"
          style={{
            fontSize: "clamp(80px, 15vw, 180px)",
            fontFamily: "'Orbitron', monospace",
            color: "#e8fff0",
            textShadow: `
              0 0 20px rgba(0,255,136,0.6),
              0 0 60px rgba(0,255,136,0.2),
              4px 4px 0 rgba(0,200,100,0.25)
            `,
            letterSpacing: "0.12em",
          }}
        >
          HALLO
        </h1>

        <s>ClassRoom</s>

        {/* ボタン */}
        <div className="flex gap-3 mt-2 pointer-events-auto">
           
          <Link href="/signIn">
            <button className="cursor-pointer px-8 py-3 font-mono backdrop-blur-xs font-bold text-sm tracking-widest uppercase border border-green-400/60 text-green-400 bg-transparent hover:bg-green-400/10 hover:shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-all duration-200">
              ▶ ENTER WORLD
            </button>
          </Link>
         
          <Link href="/signUp">
            <button className="cursor-pointer px-8 py-3 font-mono font-bold text-sm tracking-widest uppercase bg-green-400 text-neutral-950 hover:bg-green-300 hover:shadow-[0_0_24px_rgba(0,255,136,0.6)] transition-all duration-200">
              + CREATE ACCOUNT
            </button>
          </Link>

         
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
      `}</style>
    </>
  );
};

export default TopUI;
