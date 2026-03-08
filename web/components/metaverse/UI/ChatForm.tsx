"use client";

/**
 * ChatForm.tsx
 *
 * 画面下部中央に常時表示されるメッセージ入力フォーム。
 *
 * 通常時：
 *   - 全体チャット（send-avatar-message）のみ
 *
 * DM会話中：
 *   - 「全体」「○○さん（DM）」の2タブが入力フォームの上に表示される
 *   - 「全体」タブ : 従来通り send-avatar-message を emit（アバター頭上に表示）
 *   - 「DM」タブ   : send-message を emit（DM roomId宛、systemLogには流れない）
 *   - DM終了時はタブが消えて全体タブに自動的に戻る
 */

import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import { useAtomValue } from "jotai";
import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { dmStateAtom } from "@/atoms/dm";
import Controller from "./Controller";

type Tab = "global" | "dm";

const ChatForm = () => {
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<Tab>("global");
  const socket = useAtomValue(socketAtom);
  // DM会話中かどうかを参照（タブ表示・送信先の切り替えに使用）
  // const dmSession = useAtomValue(dmSessionAtom);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dmState = useAtomValue(dmStateAtom);

  useEffect(() => {
    if (dmState.status === "talking") {
      setTab("dm");
    } else {
      setTab("global");
    }
  }, [dmState]);

  /**
   * 送信ハンドラ
   * - DM タブ かつ dmSession が有効 → send-message (DM用ルームへ)
   * - 全体タブ or DM中でない      → send-avatar-message (全体・アバター頭上)
   */
  const handleSubmit = () => {
    if (!message.trim() || !socket) return;

    if (tab === "dm" && dmState.status === "talking") {
      // DM送信：systemLogには表示されず、DM履歴として保存される
      socket.emit("send-message", {
        roomId: dmState.roomId,
        content: message.trim(),
      });
    } else {
      // 全体送信：アバター頭上に吹き出し表示 & systemLogに流れる
      socket.emit("send-avatar-message", { content: message.trim() });
    }

    setMessage("");
    // テキストエリアの高さをリセット
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /** Enter キーで送信（Shift+Enter は改行） */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /** テキストエリアの自動リサイズ */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const isDmTab = tab === "dm";

  return (
    // 画面下部中央に固定（DM中も位置は変わらない）
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/2 flex flex-col items-stretch pointer-events-auto">
      {/* ── タブ切替（DM会話中のみ表示） ── */}
      {dmState.status === "talking" && (
        <div className="flex self-start">
          {/* DMタブ（相手の名前を表示） */}
          <button
            type="button"
            onClick={() => setTab("dm")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-tl-xl transition-colors cursor-pointer
              ${
                tab === "dm"
                  ? "bg-black/70 text-green-300"
                  : "bg-black/30 text-neutral-400 hover:text-neutral-200"
              }`}
          >
            {/* {dmSession.partnerName} */}
            {dmState.userName}
          </button>
          {/* 全体タブ */}
          <button
            type="button"
            onClick={() => setTab("global")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-tr-xl transition-colors cursor-pointer
              ${
                tab === "global"
                  ? "bg-black/70 text-white"
                  : "bg-black/30 text-neutral-400 hover:text-neutral-200"
              }`}
          >
            全体
          </button>
        </div>
      )}

      {/* ── 入力フォーム本体 ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={`w-full bg-black/60 rounded-xl border border-neutral-600 flex items-end p-4 gap-x-3
          ${dmState.status === "talking" ? "rounded-tl-none" : ""}
          ${isDmTab ? "ring-1 ring-green-500/40" : ""}
        `}
      >
        {/* DMモードのインジケーター */}
        {isDmTab && dmState.status === "talking" && (
          <span className="text-[10px] text-green-400 font-semibold whitespace-nowrap pb-1 select-none">
            DM
          </span>
        )}

        <Controller />
        {/* メッセージ入力エリア */}
        <textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isDmTab && dmState.status === "talking"
              ? `${dmState.userName} さんへ メッセージを入力...`
              : "メッセージを入力..."
          }
          maxLength={100}
          className="flex-1 bg-transparent outline-none text-sm resize-none overflow-hidden"
        />

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <IoSend className={`size-5 ${isDmTab ? "text-green-400" : ""}`} />
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
