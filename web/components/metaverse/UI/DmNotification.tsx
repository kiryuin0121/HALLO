"use client";

import { useAtom, useAtomValue } from "jotai";
import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import { dmStateAtom, dmToastAtom } from "@/atoms/dm";
import { AnimatePresence, motion } from "motion/react";
import { selfAtom } from "../3D/Players";
import {
  PhoneAcceptIcon,
  PhoneRejectIcon,
  PhoneRingingIcon,
} from "@/components/global/UI/Icons";
import { useEffect } from "react";

const toastColorMap: Record<
  number,
  { dot: string; code: string; label: string }
> = {
  // 通話終了
  201: {
    dot: "bg-green-400",
    code: "text-green-500/70",
    label: "text-green-600/60",
  },
  // 通話をキャンセルした
  499: {
    dot: "bg-amber-400",
    code: "text-amber-500/70",
    label: "text-amber-600/60",
  },
  // 通話をキャンセルされた
  408: { dot: "bg-red-400", code: "text-red-500", label: "text-red-500/70" },
  // 通話を拒否した
  418: { dot: "bg-amber-400", code: "text-amber-500", label: "text-amber-500/70" },
  // 通話を拒否された
  403: { dot: "bg-red-400", code: "text-red-500", label: "text-red-500/70" },
};

const DmNotification = () => {
  const socket = useAtomValue(socketAtom);
  const self = useAtomValue(selfAtom);
  const myId = self?.id;
  const [dmState, setDmState] = useAtom(dmStateAtom);
  const [dmToast, setDmToast] = useAtom(dmToastAtom);

  // toast の自動消去
  useEffect(() => {
    if (!dmToast) return;
    const timer = setTimeout(() => setDmToast(null), 3000);
    return () => clearTimeout(timer);
  }, [dmToast, setDmToast]);

  const handleCancelChatRequest = () => {
    if (!socket || dmState.status !== "pending") return;
    socket.emit("send-chatCancel", { receiverId: dmState.userId });
    setDmState({ status: "idle" });
    setDmToast({
      code: 499,
      label: "Client Closed",
      message: "通話をキャンセルしました",
    });
  };

  const handleChatResponse = async (canTalk: boolean) => {
    if (!socket) return;
    if (canTalk === true && dmState.status === "requested") {
      const { userId, userName } = dmState;
      const res = await fetch(
        `/api/chatRoom/direct?selfId=${myId}&otherId=${userId}`,
      );
      const { roomId } = await res.json();
      socket.emit("join-chatRoom", { roomId });
      socket.emit("send-chatResponse", {
        receiverId: userId,
        canTalk: true,
        roomId,
      });
      setDmState({ status: "talking", userId, userName, roomId });
    } else if (canTalk === false && dmState.status === "requested") {
      socket.emit("send-chatResponse", {
        receiverId: dmState.userId,
        canTalk: false,
      });
      setDmToast({
        code: 418,
        label: "I'm a teapot",
        message: "通話を拒否しました",
      });
      setDmState({ status: "idle" });
    }
  };

  const handleHangUp = () => {
    if (!socket || dmState.status !== "talking") return;
    socket.emit("hang-up", {
      roomId: dmState.roomId,
      receiverId: dmState.userId,
    });
    setDmState({ status: "idle" });
    setDmToast({ code: 201, label: "Created", message: "通話を終了しました" });
  };

  return (
    <AnimatePresence>
      {dmState.status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          {/* ── REQUESTED ── */}
          {dmState.status === "requested" && (
            <div className="bg-black/40 backdrop-blur-xs border border-neutral-700 rounded-lg px-6 py-4 flex flex-col items-center gap-y-3.5 shadow-xl min-w-72">
              <div className={`flex justify-start items-center gap-x-3`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="text-sm font-dotgothic text-neutral-200 tracking-wide">
                  <span className="text-white font-semibold">
                    {dmState.userName}
                  </span>
                  さんに話しかけられています
                </span>
              </div>
              <div className="flex gap-x-2.5">
                <button
                  onClick={() => handleChatResponse(true)}
                  className="flex items-center gap-x-2 px-4 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-semibold font-dotgothic cursor-pointer transition-colors"
                >
                  <PhoneAcceptIcon size={16} />
                  応答
                </button>
                <button
                  onClick={() => handleChatResponse(false)}
                  className="flex items-center gap-x-2 px-4 py-1.5 rounded-md bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-semibold font-dotgothic cursor-pointer transition-colors"
                >
                  <PhoneRejectIcon size={16} />
                  拒否
                </button>
              </div>
            </div>
          )}

          {/* ── PENDING ── */}
          {dmState.status === "pending" && (
            <div className="bg-black/40 backdrop-blur-xs border border-neutral-700 rounded-lg px-5 py-3 flex items-center gap-x-3 shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="text-sm font-dotgothic text-neutral-400">
                <span className="text-neutral-200">{dmState.userName}</span>
                さんに話しかけています…
              </span>
              {/* <button
                className="ml-1 p-1.5 rounded-md hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                onClick={handleCancelChatRequest}
              >
                <PhoneRingingIcon size={16} />
              </button> */}
              <button
                   onClick={handleCancelChatRequest}
                  className="flex items-center gap-x-2 px-4 py-1.5 rounded-md bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-semibold font-dotgothic cursor-pointer transition-colors"
                >
                  <PhoneRejectIcon size={16} />
                  終了
                </button>
            </div>
          )}

          {/* ── TALKING ── */}
          {dmState.status === "talking" && (
            <div className="bg-black/40 backdrop-blur-xs border border-neutral-700 rounded-lg px-5 py-3 flex items-center gap-x-3 shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-sm font-dotgothic text-neutral-400">
                <span className="text-green-400">{dmState.userName}</span>
                さんと通話中
              </span>
              <button
                onClick={handleHangUp}
                className="ml-auto flex items-center gap-x-1.5 px-3 py-1.5 rounded-md  bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400  text-xs font-dotgothic cursor-pointer transition-colors whitespace-nowrap"
              >
                <PhoneRejectIcon size={14} />
                終了
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Toast ── */}
      {dmToast && (
        <motion.div
          key={`toast-${dmToast.code}-${dmToast.message}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="bg-black/40 backdrop-blur-xs border border-neutral-700 rounded-lg px-5 py-2.5 flex items-center gap-x-3 shadow-xl">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${toastColorMap[dmToast.code].dot}`}
            />
            <span
              className={`text-[11px] font-mono tracking-widest ${toastColorMap[dmToast.code].code}`}
            >
              {dmToast.code}
            </span>
            <span
              className={`text-[11px] font-mono ${toastColorMap[dmToast.code].label}`}
            >
              {dmToast.label}
            </span>
            <span className="w-px h-3 bg-neutral-700 shrink-0" />
            <span className="text-xs font-dotgothic text-neutral-300">
              {dmToast.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DmNotification;
