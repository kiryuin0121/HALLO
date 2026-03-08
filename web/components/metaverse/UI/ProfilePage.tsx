"use client";
import { atom, useAtom, useSetAtom } from "jotai";
import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";
import useSWR from "swr";
import { Profile, User } from "@/types/prisma";
import { AvatarConfig } from "@/types/avatar";
import { editStateAtom } from "@/atoms/myProfile";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { settingsAtom } from "./SettingsManager";
export const profileAtom = atom<string | null>(null);
type Props = {
  isMyProfile: boolean;
};
const ProfilePage = ({ isMyProfile }: Props) => {
  const [profileUserId, setProfileUserId] = useAtom(profileAtom);
  const setEditState = useSetAtom(editStateAtom);

  // ユーザーのプロフィール情報をフェッチする。
  const { data, isLoading } = useSWR(
    `/api/profiles/${profileUserId}`,
    (url: string) =>
      fetch(url).then(
        (res) =>
          res.json() as Promise<{
            user: User;
            profile: Profile;
            avatarConfig: AvatarConfig;
          }>,
      ),
  );

  useEffect(() => {
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;
      if (key === "Escape") {
        setProfileUserId(null);
        setEditState(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading || !data) {
    return (
      <div
        className={`absolute inset-0 z-11 w-screen h-screen flex justify-center items-center bg-black text-white text-lg font-dotgothic`}
      >
        Now Loading ...
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 z-20 w-screen h-screen bg-neutral-950 text-neutral-50 overflow-hidden pointer-events-auto`}
    >
      {isMyProfile ? (
        <MyProfile userData={data} />
      ) : (
        <OtherProfile userData={data} />
      )}

       <button
        className="absolute top-[5vh] left-[10vw] -translate-y-1/2 z-21 flex items-center gap-x-1.5 border border-neutral-700 px-3 py-1.5 font-mono text-[10px] tracking-widest text-neutral-500 hover:border-neutral-500 hover:text-neutral-300 transition-all duration-200 cursor-pointer"
        onClick={() => {
          setProfileUserId(null);
          setEditState(null);
        }}
      >
        <IoIosArrowBack size={12} />
        戻る [Esc]
      </button>
    </div>
  );
};

export default ProfilePage;
