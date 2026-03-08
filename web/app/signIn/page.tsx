"use client";
import { signInAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

const SignInPage = () => {
  const [result, formAction, isPending] = useActionState(signInAction, {
    error: "",
    success: false,
  });
  const router = useRouter();
  if (result.success) router.push("/world");

  const [isShowPwd, setIsShowPwd] = useState(false);

  return (
    <section className="w-screen h-screen flex bg-[#080c10] text-neutral-100 overflow-hidden">
      {/* ===== 左パネル===== */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r border-green-500/10">
        <div className="relative z-10">
          <p className="font-mono text-[10px] tracking-[0.4em] text-green-500/50 uppercase mb-2">
            HAL東京/大阪/名古屋 専用メタバース
          </p>
          <h1
            className="font-extrabold leading-none font-orbitron"
            style={{
              fontSize: "clamp(64px, 8vw, 96px)",
              color: "#e8fff0",
              textShadow:
                "0 0 40px rgba(0,255,136,0.4), 0 0 100px rgba(0,255,136,0.1)",
              letterSpacing: "0.08em",
            }}
          >
            HALLO
          </h1>
        </div>

        <div className="relative z-10 font-mono text-xs text-green-500/30 tracking-widest space-y-1">
          HALLO_v.1.2.1
        </div>
      </div>

      {/* ===== 右パネル：フォーム ===== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 relative">
        {/* 背景レイヤー（blur + brightness のみ） */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/bg.gif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.3)",
          }}
        />

        {/* フォーム */}
        <form
          action={formAction}
          className="w-full max-w-sm flex flex-col gap-8 relative z-10"
        >
          {/* タイトル */}
          <h2 className="font-mono text-3xl font-bold tracking-widest text-white">
            SIGN IN
          </h2>

          {/* フィールド群 */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-[10px] tracking-[0.3em] text-green-500/75 uppercase"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-transparent border-b-2 border-neutral-700 text-sm text-white py-2 focus:outline-none focus:border-green-400 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-mono text-[10px] tracking-[0.3em] text-green-500/75 uppercase"
              >
                Password
              </label>
              <input
                type={isShowPwd ? "text" : "password"}
                id="password"
                name="password"
                className="w-full bg-transparent border-b-2 border-neutral-700 text-sm text-white py-2 focus:outline-none focus:border-green-400 transition-colors duration-200"
              />
              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none mt-1">
                <input
                  type="checkbox"
                  checked={isShowPwd}
                  onChange={(e) => setIsShowPwd(e.target.checked)}
                  className="accent-green-400"
                />
                パスワードを表示する
              </label>
            </div>
          </div>

          {/* エラー */}
          {result.error && (
            <p className="font-mono text-xs text-red-400 tracking-wide">
              ⚠ {result.error}
            </p>
          )}

          {/* ボタン */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 font-mono font-bold text-sm tracking-widest uppercase bg-green-400 text-neutral-950 hover:bg-green-300 hover:shadow-[0_0_32px_rgba(0,255,136,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isPending ? "CONNECTING..." : "▶ ENTER WORLD"}
            </button>

            <a
              href="/signUp"
              className="text-center font-mono text-xs text-neutral-600 hover:text-green-400 tracking-widest transition-colors duration-200"
            >
              アカウントをお持ちでない方 → CREATE ACCOUNT
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignInPage;
