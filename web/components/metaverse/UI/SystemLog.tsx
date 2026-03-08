"use client";

import { useEffect, useRef, useState } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import { GlobeIcon } from "@/components/global/UI/Icons";

type Player = {
  name: string;
  color: string;
};

type Log = {
  type: "join" | "leave" | "chat" | "start-dm" | "finish-dm";
  players: Player[];
  content?: string;
};

export const isTalkingAtom = atom(false);

const SystemLog = () => {
  const socket = useAtomValue(socketAtom);
  const isTalking = useAtomValue(isTalkingAtom);
  const [messages, setMessages] = useState<Log[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  const innerRef = useRef<HTMLDivElement>(null!);
  const endRef = useRef<HTMLDivElement>(null!);

  const setIsTalking = useSetAtom(isTalkingAtom);

  /* ===============================
      Clock (1秒更新)
  =============================== */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===============================
      Socket
  =============================== */
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-space-notification", (payload: Log) => {
      setMessages((prev) => [...prev, payload]);

      switch (payload.type) {
        case "start-dm":
          setIsTalking(true);
          break;
        case "finish-dm":
          setIsTalking(false);
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off("receive-space-notification");
    };
  }, [socket]);

  /* ===============================
      Auto Scroll
  =============================== */
  useEffect(() => {
    if (!innerRef.current || !endRef.current) return;

    const isOverflow =
      innerRef.current.scrollHeight > innerRef.current.clientHeight;

    if (isOverflow) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  /* ===============================
      Format: 25/03/01 Sun 18:13:06
  =============================== */
  const pad = (n: number) => n.toString().padStart(2, "0");

  const formattedDate = `${pad(now.getFullYear() % 100)}/${pad(
    now.getMonth() + 1
  )}/${pad(now.getDate())}`;

  const formattedTime = `${pad(now.getHours())}:${pad(
    now.getMinutes()
  )}:${pad(now.getSeconds())}`;

  return (
    <div className="absolute top-8 right-8 w-1/5 aspect-square bg-black/40 rounded-xl border border-neutral-600 overflow-hidden px-4 py-9 pointer-events-auto">

      {/* Header */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-neutral-400 font-dotgothic tracking-widest whitespace-nowrap flex justify-center items-center gap-x-1">
        <GlobeIcon size={12}/><span>{formattedDate} {formattedTime}</span>
      </div>

      {/* Log */}
      <div
        ref={innerRef}
        className="w-full h-full space-y-4 overflow-y-scroll no-scrollbar text-[10px] text-neutral-400 font-dotgothic relative"
      >
        {messages.map((message, idx) => (
          <div key={idx}>
            {(message.type === "join" ||
              message.type === "leave" ||
              message.type === "chat") && (
              <>
                <span
                  className="tracking-widest"
                  style={{ color: message.players[0]?.color }}
                >
                  {message.players[0]?.name}
                </span>

                {message.type === "join" &&
                  " さんが 入室しました。"}
                {message.type === "leave" &&
                  " さんが 退出しました。"}
                {message.type === "chat" && (
                  <span className="text-neutral-50 whitespace-pre-wrap">
                    ：{message.content}
                  </span>
                )}
              </>
            )}

            {(message.type === "start-dm" ||
              message.type === "finish-dm") && (
              <>
                <span
                  className="tracking-widest"
                  style={{ color: message.players[0]?.color }}
                >
                  {message.players[0]?.name}
                </span>
                {"、"}
                <span
                  className="tracking-widest"
                  style={{ color: message.players[1]?.color }}
                >
                  {message.players[1]?.name}
                </span>
                {message.type === "start-dm" &&
                  " さんが通話を開始しました。"}
                {message.type === "finish-dm" &&
                  " さんが通話を終了しました。"}
              </>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default SystemLog;