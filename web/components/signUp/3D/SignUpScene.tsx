"use client";
import { useAtomValue } from "jotai";
import AvatarConfigScene from "./AvatarConfigScene";
import InterviewScene from "./InterViewScene";
import { signUpStepAtom } from "@/atoms/signUp";
import { useEffect } from "react";

const SignUpScene = ({ onLoaded }: { onLoaded: () => void }) => {
  const signUpStep = useAtomValue(signUpStepAtom);
  useEffect(() => {
    onLoaded();
  }, []);
  switch (signUpStep) {
    case "avatar":
      return <AvatarConfigScene />;
    default:
      return <InterviewScene />;
  }
};

export default SignUpScene;
