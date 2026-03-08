import { z } from "zod";
import { Campus, Gender, Major, MBTI } from "@/generated/prisma/enums";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(30, "名前は、30文字以内で入力してください"),

  gender: z.enum(Gender),

  hometown: z
    .string()
    .trim()
    .min(1, "出身地を入力してください")
    .max(50, "出身地は、50文字以内で入力してください"),

  mbti: z.enum(MBTI),

  campus: z.enum(Campus),

  major: z.enum(Major),

  grade: z.number().int().min(1).max(4),

  voice: z.number().int().min(0),

  // ------------------------
  // Step3: アカウント情報
  // ------------------------
  email: z.email("メールアドレス形式で入力してください").trim().max(255),

  password: z
    .string()
    .trim()
    .min(8, "パスワードは8文字以上必要です")
    .max(100, "パスワードは100文字以上設定できません"),

  bio: z.string().max(300).default("未設定"),
});

export const signInSchema = z.object({
  email: z.email("メールアドレス形式で入力してください").max(255),
  password: z
    .string()
    .min(8, "パスワードは8文字以上必要です")
    .max(100, "パスワードは100文字以上設定できません"),
});
