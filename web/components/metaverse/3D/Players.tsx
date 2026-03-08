// Players.tsx
"use client";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { UserData, UserId } from "@/types/user";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { socketAtom } from "@/components//metaverse/UI/SessionSocketInitializer";
import MyAvatar from "./MyAvatar";
import OtherAvatar from "./OtherAvatar";
import { useVoiceVox } from "@/hooks/useVoiceVox";
import { dmStateAtom, dmToastAtom } from "@/atoms/dm";
import { profileAtom } from "../UI/ProfilePage";

// 自分の情報を管理するatom（初期化判定にも使う）
export const selfAtom = atom<UserData | null>(null);
// 他プレイヤーの情報を管理するatom
export const otherPlayersAtom = atom<UserData[]>([]);

// keyboardEventの名前
enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

const Players = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp"] },
      { name: Controls.back, keys: ["ArrowDown"] },
      { name: Controls.left, keys: ["ArrowLeft"] },
      { name: Controls.right, keys: ["ArrowRight"] },
    ],
    [],
  );


  const pronounce = useVoiceVox();

  const [self, setSelf] = useAtom(selfAtom);
  const [otherPlayers, setOtherPlayers] = useAtom(otherPlayersAtom);

  const selfRef = useRef<UserData>(null!);
  const othersRef = useRef<Map<UserId, UserData>>(new Map());

  const socket = useAtomValue(socketAtom);
  const setDmState = useSetAtom(dmStateAtom);
  const setDmToast = useSetAtom(dmToastAtom);
  
  const isShowProfilePage = useAtomValue(profileAtom);

  useEffect(() => {
    if (!socket) return;

    const handleInit = ({
      self,
      others,
    }: {
      self: UserData;
      others: Record<UserId, UserData>;
    }) => {
      selfRef.current = self;
      setSelf(self);
      const othersMap = new Map(
        Object.entries(others).map(([id, data]) => [id, data]),
      );
      othersRef.current = othersMap;
      setOtherPlayers(Array.from(othersMap.values()));
    };

    const handleEnter = ({ someone }: { someone: UserData }) => {
      othersRef.current.set(someone.id, someone);
      setOtherPlayers(Array.from(othersRef.current.values()));
    };

    const handleMove = ({ someone }: { someone: UserData }) => {
      othersRef.current.set(someone.id, someone);
      // 再レンダリングしない（useFrameで毎フレーム参照するため）
    };

    const handleLeave = ({ someoneId }: { someoneId: UserId }) => {
      othersRef.current.delete(someoneId);
      setOtherPlayers(Array.from(othersRef.current.values()));
    };

    /**
     * アバター上メッセージ受信ハンドラ
     *
     * 全体チャット（send-avatar-message）とDM（send-message）の両方で呼ばれる。
     * サーバーから isDm フラグが付いてくるので、それをそのまま message に保持する。
     * AvatarHtml / OtherAvatarHtml 側で isDm を見て吹き出しの色を緑に切り替える。
     */
    const handleAvatarMessage = ({
      userId,
      message,
    }: {
      userId: UserId;
      message: { content: string; timestamp: number; isDm?: boolean };
    }) => {
      console.log(isShowProfilePage);
      if(isShowProfilePage)return;
      if (userId === selfRef.current?.id) {
        // 自分のメッセージ：isDm フラグごと保持してアバター上に表示
        if(isShowProfilePage)return;
        selfRef.current.message = message;
        setSelf({ ...selfRef.current });
        pronounce(message.content, selfRef.current.voice || 3);
        setTimeout(() => {
          if (selfRef.current) {
            selfRef.current.message = undefined;
            setSelf({ ...selfRef.current });
          }
        }, 3000);
      } else {
        // 他プレイヤーのメッセージ：isDm フラグごと保持してアバター上に表示
        const otherPlayer = othersRef.current.get(userId);
        if (otherPlayer) {
          if(isShowProfilePage)return;
          otherPlayer.message = message;
          othersRef.current.set(userId, otherPlayer);
          setOtherPlayers(Array.from(othersRef.current.values()));
          pronounce(message.content, otherPlayer.voice || 3);
          setTimeout(() => {
            const player = othersRef.current.get(userId);
            if (player) {
              player.message = undefined;
              othersRef.current.set(userId, player);
              setOtherPlayers(Array.from(othersRef.current.values()));
            }
          }, 3000);
        }
      }
    };

    // ---------- DM関連ハンドラ ----------

    // 話しかけられたことを通知するモーダルを表示する
    const handleChatRequest = ({
      senderId,
      senderName,
    }: {
      senderId: string;
      senderName: string;
    }) => {
      setDmState({
        status: "requested",
        userId: senderId,
        userName: senderName,
      });
    };

    // 話しかけた相手からの応答を受け取る
    const handleChatResponse = ({
      senderId,
      senderName,
      canTalk,
      roomId,
    }: {
      senderId: string;
      senderName: string;
      canTalk: boolean;
      roomId?: string;
    }) => {
      if (canTalk && roomId) {
        // 自分-相手のチャットルームに参加する
        socket.emit("join-chatRoom", { roomId });
        // 会話中モーダルを表示する
        setDmState({
          status: "talking",
          userId: senderId,
          userName: senderName,
          roomId,
        });
      } else {
        // 断られた場合は初期状態へ戻す
        setDmState({ status: "idle" });
        setDmToast({
          code: 403,
          label: "Forbidden",
          message: "通話を拒否されました",
        });
      }
    };

    // 会話終了を受け取り初期状態へ戻す
    const handleHangUp = () => {
      setDmState({ status: "idle" });
      setDmToast({
        code: 201,
        label: "Created",
        message: "通話を終了しました",
      });
    };

    // 発信側がキャンセルした場合
    const handleChatCancel = ({ senderId }: { senderId: string }) => {
      setDmState((prev) => {
        if (prev.status === "requested" && prev.userId === senderId) {
          setDmToast({
            code: 408,
            label: "Request Timeout",
            message: "通話がキャンセルされました",
          });
          return { status: "idle" };
        }
        return prev;
      });
    };
    socket.on("self-init", handleInit);
    socket.on("someone-enter", handleEnter);
    socket.on("someone-move", handleMove);
    socket.on("someone-leave", handleLeave);
    socket.on("receive-avatar-message", handleAvatarMessage);
    socket.on("receive-chatRequest", handleChatRequest);
    socket.on("receive-chatResponse", handleChatResponse);
    socket.on("hang-up", handleHangUp);
    socket.on("receive-chatCancel", handleChatCancel);

    return () => {
      socket.off("self-init", handleInit);
      socket.off("someone-enter", handleEnter);
      socket.off("someone-move", handleMove);
      socket.off("someone-leave", handleLeave);
      socket.off("receive-avatar-message", handleAvatarMessage);
      socket.off("receive-chatRequest", handleChatRequest);
      socket.off("receive-chatResponse", handleChatResponse);
      socket.off("hang-up", handleHangUp);
      socket.off("receive-chatCancel", handleChatCancel);
    };
  }, [socket, setSelf, setOtherPlayers, setDmState]);

  if (!self) {
    return null;
  }

  return (
    <>
      {/* 自分 */}
      <KeyboardControls map={map}>
        <MyAvatar playerRef={selfRef} />
      </KeyboardControls>

      {/* 他の人々（それぞれが独立したメニュー状態を持つ） */}
      {otherPlayers.map((player) => (
        <OtherAvatar
          key={player.id}
          playerId={player.id}
          othersRef={othersRef}
        />
      ))}
    </>
  );
};

export default Players;
