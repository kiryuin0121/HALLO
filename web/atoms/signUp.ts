import { atom } from "jotai";
import { Campus, Gender, Major, MBTI } from "./../generated/prisma/enums";
import { Behavior } from "@/components//global/3D/KiryuYokohata";
export type Grade = 1 | 2 | 3 | 4;
export type FormState = {
  // step1:自己紹介をしよう
  name: string;
  gender?: Gender;
  hometown: string;
  mbti?: MBTI;
  campus?: Campus;
  major?: Major;
  grade?: Grade;
  // step2:オリジナルアバターを作成しよう
  avatarConfig: string;
  voice: number;
  // step3:ログイン情報を設定しよう
  email: string;
  password: string;
  bio: string;
  // step4:最終確認画面
};
export const signUpAtom = atom<FormState>({
  name: "",
  campus: "osaka",
  major: "it_web_ai",
  grade: 1,
  gender: "male",
  mbti: "INFJ",
  bio: "",
  avatarConfig: "",
  email: "",
  password: "",
  voice: 3,
  hometown: "",
});

export type SignUpStep =
  | "personal" // step1: あなたのことを教えて
  | "school" // step2: 学校生活について教えて
  | "avatar" // step3: アバター作成
  | "account" // step4: ログイン情報
  | "confirm"; // step5: 最終確認

type LineEvent = {
  type:"line";
  content:string;
  behavior?:Behavior;
}
type InputEvent = {
  type:"input";
  field: keyof FormState;
}
export type SignUpEvent = LineEvent|InputEvent;

export const sequenceNumAtom = atom(0);
export const signUpStepAtom = atom<SignUpStep>("personal");
