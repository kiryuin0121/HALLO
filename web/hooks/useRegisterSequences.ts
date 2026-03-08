import { SignUpEvent, signUpAtom } from "@/atoms/signUp";
import { MBTI } from "@/types/prisma";
import { CampusLabel } from "@/types/profile";
import { useAtom } from "jotai";
const checkCompatibility = (mbti: MBTI) => {
  if (["ENFP", "ENTP", "ESTP", "INFJ"].includes(mbti))
    return "ぴったり らしいですね！";
  if (["ESTJ", "ISTJ", "ESFP", "ENTJ"].includes(mbti)) return "微妙 らしいですね...";
  return "普通 らしいですね。";
};
export const AVATAR_CONFIG_INDEX = 36;
export const CONFIRM_INDEX = 44;
export const useRegisterSequences = () => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const REGISTER_SEQUENCES: SignUpEvent[] = [
    {
      type: "line",
      content: "はろー。メタバースHALLO へようこそ。",
    },
    {
      type: "line",
      content: "ぼくは HAL大阪 IT11Bクラスの よこはたです。",
    },
    {
      type: "line",
      content: "HALLO(ハロー)は、HAL生専用の 学内メタバースです。",
    },
    {
      type: "line",
      content:
        "HAL生に対して 校舎や学部を超えた新しい交友関係を もたらします。",
    },
    {
      type: "line",
      content:
        "ここ 032教室では HALLOに 参加するための手続きを 行うことができます。",
    },
    {
      type: "line",
      content:
        "これから あなたについて、いくつか質問していくので 気軽に答えてください。",
    },
    {
      type: "line",
      content:
        "それじゃあ、さっそくですが 一緒に 参加手続きを 進めていきましょう。",
    },
    // step1:自己紹介をしよう
    // q1:name
    {
      type: "line",
      content: "そういえば まだ 名前を 聞いていませんでしたね。",
    },
    {
      type: "line",
      content: "あなたのこと、なんて呼んだらいいですか？",
    },
    {
      type: "input",
      field: "name",
    },
    // q2:gender
    {
      type: "line",
      content: `${signUp.name} さん... とても素敵な お名前です。`,
    },
    {
      type: "line",
      content: `${signUp.name} さんは 男の子ですか？ それとも 女の子ですか？`,
    },
    {
      type: "input",
      field: "gender",
    },
    // q3:hometown
    {
      type: "line",
      content: "そうなんですね。話していて ふと思ったのですが...",
    },
    {
      type: "line",
      content: `${signUp.name} さんって なんだか 特徴的な話し方をされていますね。`,
    },
    {
      type: "line",
      content: `${signUp.name} さんは どこの出身 なんですか？`,
    },
    {
      type: "input",
      field: "hometown",
    },
    {
      type: "line",
      content: `なるほど。 ${signUp.hometown} 出身なんですね。教えてくれてありがとうございます。`,
    },
    // q4:mbti
    {
      type: "line",
      content: `ところで ${signUp.name} さんは 「MBTI診断」ってご存じですか？`,
    },
    {
      type: "line",
      content:
        "人間の性格を 16種類にパターン化して 自分がどのタイプにあてはまるかを 分類するやつです。",
    },
    {
      type: "line",
      content: "(科学的根拠とかは 全くもってないらしいですね。)",
    },
    {
      type: "line",
      content: `ぼくも 実際にやってみたところ、「INFJ(提唱者)」という性格タイプでした。`,
    },
    {
      type: "line",
      content: `${signUp.name} さんは どの性格タイプ でしたか？`,
    },
    {
      type: "input",
      field: "mbti",
    },
    // step2：学校生活について教えて
    // q1：campus
    {
      type: "line",
      content: `${signUp.mbti}... 僕との相性は ${checkCompatibility(signUp.mbti!)}`,
    },
    {
      type: "line",
      content: "はい。続きまして、学校生活に関する質問を していきますね。",
    },
    {
      type: "line",
      content: `${signUp.name} さんは HALの学生らしいですね。`,
    },
    {
      type: "line",
      content: `現在、どこの校舎に通っているんですか？`,
    },
    {
      type: "input",
      field: "campus",
    },
    // q2:major
    {
      type: "line",
      content: `そうなんですね。${CampusLabel[signUp.campus ?? "osaka"]} では どんなことを 勉強しているんですか？`,
    },
    {
      type: "input",
      field: "major",
    },
    // q3:grade
    {
      type: "line",
      content: `なるほどー。ちなみに ${signUp.name} さんって 今、何年生なんですか？`,
    },
    {
      type: "input",
      field: "grade",
    },
    // step4:アバターを設定しよう。
    {
      type: "line",
      content: `そうなんですね。 続きまして、アバターの設定を 行っていただきます。`,
    },
    {
      type: "line",
      content: `HALLOでは パーツを自由にカスタマイズし、自分だけのアバターを 作成していただけます。`,
    },
    {
      type: "line",
      content: `(設定は、のちほど マイページにて 変更可能です)`,
    },
    {
      type: "line",
      content: `それじゃあ、さっそくですが アバターの設定を行っていきましょう。`,
    },
    {
      type: "input",
      field: "avatarConfig",
    },
    // step5：ログイン情報を設定しよう。
    {
      type: "line",
      content: `おー！ いい感じです! ${signUp.name} さんらしいアバターです。`,
    },
    {
      type: "line",
      content: `最後に メタバースに入るための ログイン情報を決めてください。`,
    },
    {
      type: "input",
      field: "email",
    },
    {
      type: "line",
      content: `ありがとうございます。これで セキュリティ面も ばっちりですね。`,
    },
     {
      type: "line",
      content: `以上で 参加手続きは 完了となります。お付き合いいただきありがとうございました。`,
    },
     {
      type: "line",
      content: `それでは、HALLOにて また会いましょう。`,
    }
  ];
  return REGISTER_SEQUENCES;
};
