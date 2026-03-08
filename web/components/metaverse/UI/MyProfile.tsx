"use client";
import MyProfileUI from "./MyProfileUI";

import { AvatarConfig } from "@/types/avatar";
import { Profile, User } from "@/types/prisma";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { initAvatarStateAtom, initMyProfileAtom } from "@/atoms/myProfile";
import MyProfileScene from "../3D/MyProfileScene";


type Props = {
  userData: {
    user: User;
    profile: Profile;
    avatarConfig: AvatarConfig;
  };
};

const MyProfile = ({ userData }: Props) => {
  // ユーザープロフィール＆カスタムアバター関連のatom(globalState)を初期化する。
  const initAvatarState = useSetAtom(initAvatarStateAtom);
  const initMyProfile = useSetAtom(initMyProfileAtom);
  useEffect(() => {
    initAvatarState(userData.avatarConfig);
    initMyProfile(userData);
  }, []);
  return (
    <section className={`relative w-screen h-screen overflow-hidden`}>
      {/* UI(パネル、ボタンなど)*/}
      <MyProfileUI
      />
      {/* 3D(モデル、照明など)*/}
      <MyProfileScene />
    </section>
  );
};

export default MyProfile;
