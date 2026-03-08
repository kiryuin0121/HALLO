"use client";
import { signUpAtom } from "@/atoms/signUp";
import { Campus, Gender, Major, MBTI } from "@/generated/prisma/enums";
import { signUpAction } from "@/lib/actions/auth";
import {
  CampusLabel,
  GenderLabel,
  Grade,
  MajorLabel,
  MBTILabel,
} from "@/types/profile";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { LuPencil, LuPencilOff } from "react-icons/lu";

const UI = () => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const [isEditig, setIsEditing] = useState(false);
  const [result, formAction, isPending] = useActionState(signUpAction, {
    success: false,
    error: "",
  });

  const formRef = useRef<HTMLFormElement>(null!);
  const router = useRouter();

  useEffect(() => {
    if (!result.success) return;
    router.push("/world");
  }, [result.success]);

  const handleClick = () => {
    setIsEditing((ie) => !ie);
  };

  const selectBase = "bg-transparent no-scrollbar appearance-auto outline-none";
  const readonlyStyle = !isEditig ? "text-white/90" : "";

  return (
    <div className="fixed z-10 inset-0 text-white">
      <h1 className="text-xl font-bold text-neutral-50 font-mplus absolute left-16 tracking-widest top-16">
        STEP5:最終確認画面
      </h1>

      {/* Left */}
      <div className="absolute bottom-20 left-20 px-12 py-10 rounded-xl bg-white/10 backdrop-blur-xs min-w-sm space-y-4">
        <div className="text-4xl font-bold relative">{signUp.name}</div>
        <div className="text-sm w-fit">
          {CampusLabel[signUp.campus || "osaka"]}
        </div>
      </div>

      {/* Right */}
      <form
        action={formAction}
        ref={formRef}
        className="absolute bottom-20 right-20 min-w-md px-12 py-12 rounded-xl bg-white/10 backdrop-blur-xs"
      >
        <div className="space-y-10">
          {/* 基本情報 */}
          <div>
            <div className="text-xs text-white/40 mb-6">基本情報</div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-sm">
              {/* 名前 */}
              <div className="syapce-y-1">
                <div className="text-white/40 text-xs">名前</div>
                <div className="relative">
                  <input
                    type="text"
                    value={signUp.name}
                    readOnly={!isEditig}
                    onChange={(e) =>
                      setSignUp((su) => ({
                        ...su,
                        name: e.target.value,
                      }))
                    }
                    className={`bg-transparent outline-none ${
                      !isEditig && "pointer-events-none text-white/90"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                    onClick={handleClick}
                  >
                    {isEditig ? <LuPencilOff /> : <LuPencil />}
                  </button>
                </div>
              </div>

              {/* 性別 */}
              <div className="space-y-1">
                <div className="text-white/40 text-xs">性別</div>
                <select
                  value={signUp.gender}
                  disabled={!isEditig}
                  onChange={(e) =>
                    setSignUp((su) => ({
                      ...su,
                      gender: e.target.value as Gender,
                    }))
                  }
                  className={`${selectBase} ${readonlyStyle}`}
                >
                  {Object.values(Gender).map((g) => (
                    <option className="bg-black" key={g} value={g}>
                      {GenderLabel[g]}
                    </option>
                  ))}
                </select>
              </div>

              {/* MBTI */}
              <div className="space-y-1">
                <div className="text-white/40 text-xs">MBTI</div>
                <select
                  value={signUp.mbti}
                  disabled={!isEditig}
                  onChange={(e) =>
                    setSignUp((su) => ({
                      ...su,
                      mbti: e.target.value as MBTI,
                    }))
                  }
                  className={`${selectBase} ${readonlyStyle}`}
                >
                  {Object.values(MBTI).map((m) => (
                    <option className="bg-black" key={m} value={m}>
                      {MBTILabel[m]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 学校情報 */}
          <div>
            <div className="text-xs text-white/40 mb-6">学校情報</div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-sm">
              {/* 校舎 */}
              <div className="space-y-1">
                <div className="text-white/40 text-xs">校舎</div>
                <select
                  value={signUp.campus}
                  disabled={!isEditig}
                  onChange={(e) =>
                    setSignUp((su) => ({
                      ...su,
                      campus: e.target.value as Campus,
                    }))
                  }
                  className={`${selectBase} ${readonlyStyle}`}
                >
                  {Object.values(Campus).map((c) => (
                    <option className="bg-black" key={c} value={c}>
                      {CampusLabel[c]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 学部 */}
              <div className="space-y-1">
                <div className="text-white/40 text-xs">学部</div>
                <select
                  value={signUp.major}
                  disabled={!isEditig}
                  onChange={(e) =>
                    setSignUp((su) => ({
                      ...su,
                      major: e.target.value as Major,
                    }))
                  }
                  className={`${selectBase} ${readonlyStyle}`}
                >
                  {Object.values(Major).map((m) => (
                    <option className="bg-black" key={m} value={m}>
                      {MajorLabel[m]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 学年 */}
              <div className="space-y-1">
                <div className="text-white/40 text-xs">学年</div>
                <select
                  value={signUp.grade}
                  disabled={!isEditig}
                  onChange={(e) =>
                    setSignUp((su) => ({
                      ...su,
                      grade: Number(e.target.value) as Grade,
                    }))
                  }
                  className={`${selectBase} ${readonlyStyle}`}
                >
                  {[1, 2, 3, 4].map((g) => (
                    <option className="bg-black" key={g} value={g}>
                      {g}年
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* hidden for server */}
          <input type="hidden" name="name" value={signUp.name} />
          <input type="hidden" name="gender" value={signUp.gender} />
          <input type="hidden" name="mbti" value={signUp.mbti} />
          <input type="hidden" name="campus" value={signUp.campus} />
          <input type="hidden" name="major" value={signUp.major} />
          <input type="hidden" name="grade" value={signUp.grade} />
          <input
            type="hidden"
            name="avatarConfig"
            value={signUp.avatarConfig}
          />
          <input type="hidden" name="email" value={signUp.email} />
          <input type="hidden" name="bio" value={signUp.bio} />
          <input type="hidden" name="password" value={signUp.password} />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="absolute -top-28 right-0 font-mplus tracking-widest font-bold bg-indigo-500 text-white px-8 py-4 rounded-xl cursor-pointer hover:bg-indigo-400"
        >
          メタバースへ入室する
        </button>
      </form>

      {!result.success && result.error !== "" && (
        <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-red-500">
          {result.error}
        </p>
      )}
    </div>
  );
};

export default UI;
