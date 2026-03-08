"use client";
import { Canvas } from "@react-three/fiber";

import { Suspense, useEffect, useState } from "react";
import { SignUpStep, signUpStepAtom } from "@/atoms/signUp";
import { useAtomValue, useSetAtom } from "jotai";
import { initAvatarStateAtom } from "@/atoms/avatar";
import SignUpScene from "@/components/signUp/3D/SignUpScene";
import SignUpUI from "@/components/signUp/UI/SignUpUI";
import Loading from "@/components/global/UI/Loading";

const SignUpPage = () => {
  const [loaded, setLoaded] = useState(false);
  const signUpStep = useAtomValue(signUpStepAtom);
  const initAvatarState = useSetAtom(initAvatarStateAtom);
  useEffect(() => {
    initAvatarState();
  }, [initAvatarState]);
  const getSceneKey = (step: SignUpStep) => {
    switch (step) {
      case "avatar":
        return "avatar";
      case "confirm":
        return "confirm";
      default:
        return "interview";
    }
  };

  return (
    <main className={`w-screen h-screen overflow-hidden relative`}>
      {/* 背景画像 */}
      <div className="absolute inset-0 -z-10 bg-[url(/images/bg.gif)] bg-no-repeat bg-cover bg-center brightness-[0.4]" />

      {/* 3d */}
      <Canvas>
        <Suspense fallback={null}>
          <SignUpScene
            key={getSceneKey(signUpStep)}
            onLoaded={() => setLoaded(true)}
          />
        </Suspense>
      </Canvas>
      {/* ui */}
      {loaded ? <SignUpUI /> : <Loading />}
    </main>
  );
};

export default SignUpPage;
