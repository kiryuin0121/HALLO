import { useAtomValue } from "jotai";
import { FormEvent, useEffect, useRef, useState } from "react";
import { socketAtom } from "./SessionSocketInitializer";
import useSWR from "swr";
import { selfAtom } from "../3D/Players";
import { Message, User } from "@/types/prisma";
import { IoSend } from "react-icons/io5";

type Props = { user: User };

const PrivateChat = ({ user }: Props) => {
  const self = useAtomValue(selfAtom);
  const selfId = self?.id;

  const { data, isLoading } = useSWR(
    selfId
      ? `/api/chatRoom/direct/messages?selfId=${selfId}&otherId=${user.id}`
      : null,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const [roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const socket = useAtomValue(socketAtom);
  const [content, setContent] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null!);
  const bottomRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!data) return;
    setRoomId(data.roomId);
    setMessages(data.messages);
  }, [data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || roomId === "") return;
    socket.emit("join-chatRoom", { roomId });

    const handleReceiveMessage = ({ message }: { message: Message }) => {
      setMessages((prev) => [...(prev ?? []), message]);
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, roomId]);

  // textarea自動リサイズ
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }, [content]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !roomId || !content.trim()) return;

    socket.emit("send-message", { roomId, content });
    setContent("");

    // 高さリセット
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    inputRef.current?.focus();
  };

  // Enter送信 / Shift+Enter改行
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
        {isLoading || messages === undefined ? (
          <p className="font-mono text-[10px] text-neutral-600 tracking-widest">
            /* チャット履歴を取得中... */
          </p>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-y-2 text-center py-8">
            <p className="text-neutral-500 text-[12px] leading-relaxed">
              /* まだ会話はありません。最初のメッセージを送ってみましょう。 */
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === selfId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-y-0.5 ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest px-1">
                  {isMine ? "YOU" : user.name.toUpperCase()}
                </span>
                <div
                  className={`px-4 py-2 font-mono text-[12px] max-w-[80%] leading-relaxed rounded-xs whitespace-pre-wrap
                  ${
                    isMine
                      ? "bg-sky-400/30 text-white border border-neutral-700"
                      : "bg-neutral-800/80 text-neutral-100 border border-neutral-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="shrink-0 border-t border-neutral-800 flex items-end bg-neutral-800/60"
      >
        <span className="font-mono text-lg text-green-400 px-3 shrink-0 pb-3">
          {">"}
        </span>

        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={` ${user.name} さんにメッセージを入力...`}
          className="flex-1 bg-transparent outline-none text-[13px] font-mono text-neutral-200 placeholder:text-neutral-600 placeholder:text-xs py-3 resize-none overflow-hidden"
        />

        <button
          type="submit"
          disabled={!content.trim()}
          className="shrink-0 flex items-center gap-x-1.5 px-4 py-3 font-mono text-[10px] tracking-widest text-green-400 hover:text-green-300 transition-colors duration-150 disabled:text-neutral-700 disabled:cursor-not-allowed"
        >
          <IoSend size={16} />
        </button>
      </form>
    </div>
  );
};

export default PrivateChat;