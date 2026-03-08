"use client";

import { UserData } from "@/types/user";
import { Html } from "@react-three/drei";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import { dmStateAtom } from "@/atoms/dm";
import { modalAtom } from "../UI/Modal";
import { profileAtom } from "../UI/ProfilePage";
import { ChatIcon, ProIcon } from "@/components/global/UI/Icons";

const OtherAvatarHtml = ({
  playerRef,
  showMenu,
  setShowMenu,
}: {
  playerRef: React.RefObject<UserData>;
  /** このアバター専用の開閉状態（OtherAvatar.tsx の useState から渡される） */
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const message = playerRef.current?.message;
  const hasMessage = message && message.content;
  const [profile, setProfile] = useAtom(profileAtom);
  const [modalContent, setModalContent] = useAtom(modalAtom);
  const socket = useAtomValue(socketAtom);
  const setDmState = useSetAtom(dmStateAtom);
  /**
   * isDm が true のとき吹き出しを緑色で表示する。
   * サーバーの send-message ハンドラが isDm:true を付けて
   * receive-avatar-message を emit するため、DM送信時に自動的に緑になる。
   */
  const isDm = message?.isDm === true;
  const isShowProfilePage = useAtomValue(profileAtom);

  // 「話しかける」ボタン押下ハンドラ
  const handleChatRequest = () => {
    if (!socket || !playerRef.current) return;

    const receiverId = playerRef.current.id;
    const receiverName = playerRef.current.name;

    // WSサーバー経由で相手側に話しかけたことを通知する
    socket.emit("send-chatRequest", { receiverId });

    // 話しかけ中（pending）モーダルを表示する
    setDmState({
      status: "pending",
      userId: receiverId,
      userName: receiverName,
    });
  };

  return (
    <Html position={[0, 4.3, 0]} center>
      <div className="flex flex-col items-center gap-y-2 relative">
        {/* メッセージ吹き出し */}
        <AnimatePresence>
          {hasMessage && isShowProfilePage === null && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center"
            >
              <div
                className={`
          w-64 max-w-[280px]
          rounded-2xl px-4 py-3
          backdrop-blur-md
          border shadow-2xl
          ${
            isDm
              ? "bg-green-200/40 border-green-300/50 shadow-green-500/20"
              : "bg-white/40 border-white/30 shadow-black/30"
          }
        `}
              >
               

                <p
                  className="
          text-sm font-medium
          text-neutral-900
          text-center leading-relaxed
          wrap-break-word whitespace-pre-wrap
        "
                >
                  {message.content}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* コンテキストメニュー（アバタークリック時に表示） */}
        <AnimatePresence>
          {showMenu && (
            <motion.ul
              initial={{ y: 4, opacity: 0, scale: 0.75 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 4, opacity: 0 }}
              className="absolute -top-20 p-4 w-fit aspect-3/2 bg-black/40 backdrop-blur-xs rounded-xl space-y-4 text-neutral-200"
            >
              <li>
                <button
                  className="cursor-pointer transition-200 hover:text-indigo-400 flex items-center gap-x-2"
                  onClick={() => {
                    setShowMenu(false);
                    modalContent && setModalContent(null);
                    setProfile(playerRef.current.id);
                  }}
                >
                  {/* <FaRegCircleUser size={18} /> */}
                  <ProIcon size={18} />
                  <div className="text-xs font-medium font-dotgothic">
                    プロフィール
                  </div>
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer transition-200 hover:text-indigo-400 flex items-center gap-x-2"
                  onClick={() => {
                    setShowMenu(false);
                    modalContent && setModalContent(null);
                    handleChatRequest();
                  }}
                >
                  {/* <IoChatbubbleEllipsesOutline size={20} /> */}
                  <ChatIcon size={20} />
                  <div className="text-xs font-medium font-dotgothic">
                    話しかける
                  </div>
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        {/* 名前ラベル（他UIが表示中は非表示） */}
        <div
          className={`tracking-widest text-xs font-dotgothic font-semibold min-w-40 text-center ${(hasMessage || modalContent || profile || showMenu) && "opacity-0"}`}
        >
          {playerRef.current?.name}
        </div>
      </div>
    </Html>
  );
};

export default OtherAvatarHtml;
