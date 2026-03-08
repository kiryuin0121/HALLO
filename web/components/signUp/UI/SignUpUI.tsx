"use client";

import Dialogue from "@/components//signUp/UI/Dialogue";
import {
  AVATAR_CONFIG_INDEX,
  CONFIRM_INDEX,
  useRegisterSequences,
} from "@/hooks/useRegisterSequences";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useActionState } from "react";
import InputText from "./InputText";
import SelectOption from "./SelectOption";
import SelectMBTI from "./SelectMBTI";
import InputAccount from "./InputAccount";
import { sequenceNumAtom, signUpAtom, signUpStepAtom } from "@/atoms/signUp";
import AvatarConfigUI from "./AvatarConfigUI";
import { signUpAction } from "@/lib/actions/auth";

const SignUpUI = () => {
  const [sequenceNum, setSequenceNum] = useAtom(sequenceNumAtom);
  const REGISTER_SEQUENCES = useRegisterSequences();
  const registerEvent = REGISTER_SEQUENCES[sequenceNum];
  const [signUpStep,setSignUpStep]=useAtom(signUpStepAtom);
  const signUp = useAtomValue(signUpAtom);
  const formRef = useRef<HTMLFormElement>(null);

  const [actionState, formAction, isPending] = useActionState(signUpAction, {
    success: false,
    error: "",
  });

  const isLastSequence = sequenceNum === REGISTER_SEQUENCES.length - 1;

  const nextDialogue = () => {
    if (sequenceNum === AVATAR_CONFIG_INDEX) {
      setSignUpStep("avatar");
    }
    if (isLastSequence) {
      formRef.current?.requestSubmit();
      return;
    }
    setSequenceNum((sn) => sn + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (registerEvent.type === "input") return;
      if (signUpStep === "avatar") return;
      if (e.code === "Enter" && registerEvent.type === "line") {
        e.preventDefault();
        nextDialogue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [registerEvent.type, sequenceNum]);

  // エラー監視用
  useEffect(() => {
  //エラーになったら謝罪して、もう一度入力してもらう
  if (actionState.error) {
    setSequenceNum(0);
    setSignUpStep("personal");
    alert(`ごめんちゃい♡(${actionState.error})`);
  }
}, [actionState.error]);
  return (
    // signUpAtomの値をhidden inputとしてフォームに含める
    <form ref={formRef} action={formAction}>
      {/* jotaiのatom値をhidden inputとして埋め込む */}
      <input type="hidden" name="name" value={signUp.name ?? ""} />
      <input type="hidden" name="gender" value={signUp.gender ?? ""} />
      <input type="hidden" name="hometown" value={signUp.hometown ?? ""} />
      <input type="hidden" name="mbti" value={signUp.mbti ?? ""} />
      <input type="hidden" name="campus" value={signUp.campus ?? ""} />
      <input type="hidden" name="major" value={signUp.major ?? ""} />
      <input type="hidden" name="grade" value={signUp.grade ?? ""} />
      <input type="hidden" name="voice" value={signUp.voice ?? ""} />
      <input type="hidden" name="bio" value={signUp.bio ?? ""} />
      <input type="hidden" name="email" value={signUp.email ?? ""} />
      <input type="hidden" name="password" value={signUp.password ?? ""} />
      <input
        type="hidden"
        name="avatarConfig"
        value={signUp.avatarConfig ??""}
      />

      <div className="absolute inset-0 w-screen h-screen flex flex-col items-center justify-end pointer-events-none">
        {/* テキスト */}
        {!isPending && registerEvent.type === "line" && (
          <Dialogue speaker="よこはた" onClick={nextDialogue}>
            {registerEvent.content}
          </Dialogue>
        )}

        {/* 入力 */}
        {!isPending && registerEvent.type === "input" && (
          <>
            {(() => {
              switch (registerEvent.field) {
                case "name":
                case "hometown":
                case "bio":
                  return <InputText field={registerEvent.field} />;
                case "campus":
                case "major":
                case "grade":
                case "gender":
                  return <SelectOption field={registerEvent.field} />;
                case "mbti":
                  return <SelectMBTI />;
                case "email":
                  return <InputAccount />;
                case "avatarConfig":
                  return <AvatarConfigUI />;
                default:
                  return null;
              }
            })()}
          </>
        )}
      </div>
    </form>
  );
};

export default SignUpUI;