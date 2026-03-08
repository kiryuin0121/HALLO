"use client";

import { UserData } from "@/types/user";
import { Html } from "@react-three/drei";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAtomValue } from "jotai";
import { profileAtom } from "../UI/ProfilePage";
import { modalAtom } from "../UI/Modal";

const AvatarHtml = ({
  playerRef,
}: {
  playerRef: React.RefObject<UserData>;
}) => {
  const message = playerRef.current?.message;
  const hasMessage = message && message.content;
  const profile = useAtomValue(profileAtom);
  const modalContent = useAtomValue(modalAtom);

  /**
   * isDm が true のとき吹き出しを緑色で表示する。
   * サーバーの send-message ハンドラが isDm:true を付けて
   * receive-avatar-message を emit するため、DM送信時に自動的に緑になる。
   */
  const isDm = message?.isDm === true;
  const isShowProfilePage = useAtomValue(profileAtom);
  // console.log(isShowProfilePage);
  return (
    <Html position={[0, 4.3, 0]} center>
      <div className="flex flex-col items-center gap-y-2">
        {/* メッセージ吹き出し */}
        <AnimatePresence>
          {hasMessage && isShowProfilePage == null && (
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
          backdrop-blur-za
          border shadow-2xl
          ${
            isDm
              ? "bg-green-300/75 border-green-300/50 shadow-green-500/20"
              : "bg-white/75 border-white/30 shadow-black/30"
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

        {/* 名前ラベル（他UIが表示中は非表示） */}
        <div
          className={`tracking-widest text-xs font-dotgothic font-semibold min-w-40 text-center ${(hasMessage || modalContent || profile) && "opacity-0"}`}
        >
          {playerRef.current?.name}
        </div>
      </div>
    </Html>
  );
};

export default AvatarHtml;
