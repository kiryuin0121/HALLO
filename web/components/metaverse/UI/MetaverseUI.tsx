"use client";
import OnlineUserList from "./OnlineUserList";
import SystemLog from "./SystemLog";
import ChatForm from "./ChatForm";
import Modal, { modalAtom } from "./Modal";
import Controller from "./Controller";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { User } from "@/generated/prisma/client";
import ProfilePage, { profileAtom } from "./ProfilePage";
import { sessionAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import DmNotification from "./DmNotification";
import {
  LogoutIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/global/UI/Icons";

export const usersAtom = atom<User>();
const UI = () => {
  const [modalContent, setModalContent] = useAtom(modalAtom);
  const session = useAtomValue(sessionAtom);

  const [profile, setProfile] = useAtom(profileAtom);
  const myId = session?.user.id as string;
  const isMyProfile = myId === profile;
  return (
    <div
      className={`w-screen h-screen absolute z-10 overflow-hidden pointer-events-none`}
    >
      {/* ログ(○○さんが参加しました) */}
      <SystemLog />
      {/* 現在入室中のユーザー一覧リスト */}
      <OnlineUserList />
      {/* チャット入力欄(記述内容はMetaverse内のアバターの頭上に吹き出しとして出現) */}
      <ChatForm />
      {/* DM関連のモーダル(○○さんに話しかけられました/会話中です) */}
      <DmNotification />
      {/* ユーザー一覧リスト(検索も可能)、設定、退出(退出しますか？はいorいいえ) の内容を表示。ヘッダータブで内容を切り替えられる。*/}
      {modalContent && <Modal />}

      {/* プロフィール画面 */}
      {profile && <ProfilePage isMyProfile={isMyProfile} />}

      {/* ボタン */}
      <ul
        className={`absolute right-8 bottom-8 flex flex-col justify-center items-center gap-y-4 pointer-events-auto bg-black/40 px-2 py-4 lg:py-8 rounded-xl border border-neutral-600`}
      >
        <li>
          {/* マイページを表示する */}
          <button
            type="button"
            className={`cursor-pointer transition-colors duration-100 hover:text-neutral-200`}
            onClick={() => {
              modalContent && setModalContent(null);
              setProfile(myId);
            }}
          >
            <UserIcon size={23}/>
          </button>
        </li>
        <li>
          {/* ユーザー一覧リストをモーダルに表示する*/}
          <button
            type="button"
            onClick={() => setModalContent("users")}
            className={`cursor-pointer transition-colors duration-100 hover:text-neutral-200`}
          >
            <UsersIcon size={23}/>
          </button>
        </li>
        <li>
          {/* 設定画面をモーダルに表示する */}
          <button
            type="button"
            onClick={() => setModalContent("settings")}
            className={`cursor-pointer transition-colors duration-100 hover:text-neutral-200`}
          >
            <SettingsIcon size={23}/>
          </button>
        </li>
        <li>
          {/* 退出確認をモーダルに表示する */}
          <button
            type="button"
            onClick={() => setModalContent("singOut")}
            className={`cursor-pointer transition-colors duration-100 hover:text-neutral-200`}
          >
            <LogoutIcon size={23}/>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UI;
