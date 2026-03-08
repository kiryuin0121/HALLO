import { Profile, User } from "@/types/prisma";
import {
  CampusLabel,
  GenderLabel,
  MajorLabel,
  MBTILabel,
} from "@/types/profile";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { PiChatText } from "react-icons/pi";
import { otherPlayersAtom } from "../3D/Players";
import { useState } from "react";
import PrivateChat from "./PrivateChat";

type Tab = "profile" | "chat";

const CRTOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-size-[100%_3px]" />
);

const JsonRow = ({
  label,
  isStr = true,
  children,
}: {
  label: string;
  isStr?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-baseline gap-x-1.5 font-mono text-[13px] leading-[1.9]">
    <span className="text-sky-500 text-[11px] shrink-0 w-20 text-right">
      {label}
    </span>
    <span className="text-neutral-600 shrink-0">:</span>
    {isStr && <span className="text-amber-400/50 shrink-0">"</span>}
    <span className={isStr ? "text-amber-100" : "text-violet-300"}>
      {children}
    </span>
    {isStr && <span className="text-amber-400/50 shrink-0">"</span>}
    <span className="text-neutral-700 shrink-0">,</span>
  </div>
);

type Props = { user: User; profile: Profile };

const OtherProfileUI = ({ user, profile }: Props) => {
  const otherPlayers = useAtomValue(otherPlayersAtom);
  const isOnline = otherPlayers.some((p) => p.id === user.id);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const isChatOpen = activeTab === "chat";

  return (
    <div className="w-screen h-screen absolute z-21 overflow-hidden pointer-events-none">
      {/* 背景グラデーション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-y-0 left-0 w-[52%] bg-linear-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute top-[10vh] inset-x-0 h-px bg-neutral-800/40" />
        <div className="absolute bottom-[10vh] inset-x-0 h-px bg-neutral-800/40" />
      </motion.div>

      {/* ヘッダー */}
      <header className="absolute top-0 inset-x-0 h-[10vh] flex items-center justify-end pr-[10vw] pointer-events-none">
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveTab(isChatOpen ? "profile" : "chat")}
            className={`cursor-pointer border px-3 py-1.5 flex items-center gap-x-1.5 transition-all duration-200 font-mono text-[10px] tracking-widest
              ${
                isChatOpen
                  ? "border-sky-500/50 text-sky-300 bg-sky-400/5"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200"
              }`}
          >
            <PiChatText size={13} />
            CHAT
            {isChatOpen && (
              <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* 名前 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-[15vh] left-[10vw] pointer-events-none"
      >
        <div className="font-mono text-[9px] text-neutral-600 tracking-[0.35em] mb-2">
          PROFILE
        </div>
        <div className="text-white text-[36px] font-bold tracking-wide leading-none">
          {user.name}
        </div>
        <div className="mt-2.5 font-mono text-[11px] tracking-widest flex items-center gap-x-2">
          <span
            className={`w-1 aspect-square rounded-full ${isOnline ? "bg-emerald-500" : "bg-neutral-600"}`}
          />
          <span className={isOnline ? "text-emerald-600" : "text-neutral-600"}>
            {isOnline ? "STATUS_ONLINE" : "STATUS_OFFLINE"}
          </span>
        </div>
      </motion.div>

      {/* エディタ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          left: isChatOpen ? "55%" : "10vw",
          top: isChatOpen ? "50%" : "31vh",
          x: isChatOpen ? "-50%" : "0%",
          y: isChatOpen ? "-50%" : "0%",
          width: isChatOpen ? "55vw" : "auto",
          height: isChatOpen ? "75vh" : "auto",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute  pointer-events-auto bg-black/70 border border-neutral-800 backdrop-blur-sm flex flex-col overflow-hidden"
      >
        {/* タブバー */}
        <div className="flex items-center border-b border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 border-r border-neutral-800 flex items-center gap-x-2 cursor-pointer transition-colors duration-150
              ${
                !isChatOpen
                  ? "font-semibold bg-black/40 border-t border-t-amber-400/60"
                  : "bg-neutral-900/20 border-t border-t-transparent hover:bg-neutral-800/30"
              }`}
          >
            <span className="text-amber-400 font-black text-[11px]">
              {"{ }"}
            </span>
            <span
              className={`font-mono text-[11px] ${!isChatOpen ? "text-neutral-300" : "text-neutral-600"}`}
            >
              profile.json
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 border-r border-neutral-800 flex items-center gap-x-2 cursor-pointer transition-colors duration-150
              ${
                isChatOpen
                  ? "font-semibold bg-black/40 border-t border-t-sky-400/60"
                  : "bg-neutral-900/20 border-t border-t-transparent hover:bg-neutral-800/30"
              }`}
          >
            <PiChatText size={12} className={"text-sky-400"} />
            <span
              className={`font-mono text-[11px] ${isChatOpen ? "text-neutral-300" : "text-neutral-600"}`}
            >
              chat.log
            </span>
          </button>
        </div>

        {/* コンテンツ */}
        <AnimatePresence mode="wait">
          {!isChatOpen ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="min-w-[calc(100vw/3)] w-fit flex gap-x-3 px-4 py-4 overflow-hidden"
            >
              <div className="flex flex-col items-end select-none shrink-0">
                {Array.from({ length: 13 }).map((_, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] text-neutral-700 leading-[1.9]"
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[13px] text-neutral-500 leading-[1.9]">
                  {"{"}
                </div>
                <div className="font-mono text-[11px] text-neutral-700 leading-[1.9] pl-8">
                  {"// 基本情報"}
                </div>
                <JsonRow label="name">{user.name}</JsonRow>
                <JsonRow label="hometown">{profile.hometown || "—"}</JsonRow>
                <JsonRow label="gender">{GenderLabel[profile.gender]}</JsonRow>
                <JsonRow label="mbti">{MBTILabel[profile.mbti]}</JsonRow>
                <div className="font-mono text-[11px] text-neutral-700 leading-[1.9] pl-8">
                  {"// 学校情報"}
                </div>
                <JsonRow label="campus">{CampusLabel[profile.campus]}</JsonRow>
                <JsonRow label="major">{MajorLabel[profile.major]}</JsonRow>
                <JsonRow label="grade" isStr={false}>
                  {profile.grade}
                </JsonRow>
                <div className="font-mono text-[13px] text-neutral-500 leading-[1.9]">
                  {"}"}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-h-0 overflow-hidden"
            >
              <PrivateChat user={user} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ステータスバー */}
        {!isChatOpen && (
          <div className="border-t border-neutral-800 px-4 py-1.5 flex items-center justify-between bg-neutral-900/30 shrink-0">
            <div className={`flex items-center justify-start gap-x-2`}>
              <span
                className={`w-1.5 h-1.5 rounded-full  bg-emerald-500`}
              ></span>
              <span className="font-mono text-[9px] text-neutral-600 tracking-widest">
                {isChatOpen ? "DIRECT_MESSAGE" : "READ_ONLY"}
              </span>
            </div>
            <span className="font-mono tracking-wider text-[10px] text-neutral-700">
              {"{}"}
              <span className={`mx-0.5`}>JSON</span>
            </span>
          </div>
        )}
        <CRTOverlay />
      </motion.div>

      {/* フッター */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 inset-x-0 h-16 flex items-center justify-between px-10 pointer-events-none"
      >
        <span className="font-mono text-[10px] text-neutral-700 tracking-widest">
          {isChatOpen
            ? "profile.json でプロフィールに戻る"
            : "chat.log でメッセージを送る"}
        </span>
        <span className="font-mono text-[10px] text-neutral-700 tracking-widest">
          HALLO v1.2.1
        </span>
      </motion.footer>
    </div>
  );
};

export default OtherProfileUI;
