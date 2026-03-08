import express from "express";
import os from "os";
import { createServer } from "node:http";
import { Server } from "socket.io";
import prisma from "../lib/prisma.js";
import type { UserData, UserId } from "../types/user.js";
import { buildAvatarConfig } from "../lib/buildAvatarConfig.js";
import { generateUserColor } from "../lib/getUserColor.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/** 現在メタバース空間に入室中のユーザー情報一覧（key: userId） */
const everyone: Record<UserId, UserData> = {};
/** グローバルチャットルームのID */
let SPACE_CHATROOM_ID: string;

io.on("connection", async (socket) => {
  // 新規でws接続してきたユーザーのuserIdを取得
  const userId = socket.handshake.auth.token as string | null;
  if (!userId) {
    console.log("userIDの取得に失敗しました");
    socket.emit("error", { error: "userIdの取得に失敗しました" });
    socket.disconnect();
    return;
  }
  // 自分のuserIdをルーム名とするプライベートルームに参加
  socket.join(userId);

  // --------------------グローバルチャットルームに参加--------------------
  // グローバルチャットルームのidを取得し、ユーザーをチャットルームに参加させる。(存在しなければ新しく生成する。)
  const spaceChatRoom = await prisma.chatRoom.findFirst({
    where: { chatStyle: "space" },
    select: { id: true },
  });

  if (spaceChatRoom) {
    SPACE_CHATROOM_ID = spaceChatRoom.id;
    socket.join(SPACE_CHATROOM_ID);
  } else {
    try {
      const newSpaceChatRoom = await prisma.chatRoom.create({
        data: { chatStyle: "space" },
        select: { id: true },
      });
      SPACE_CHATROOM_ID = newSpaceChatRoom.id;
      socket.join(SPACE_CHATROOM_ID);
    } catch (error) {
      console.log(error);
    }
  }

  // --------------------ユーザーデータを取得-------------------
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profile: {
          select: { voice: true },
        },
        avatar: {
          include: {
            avatarParts: {
              include: {
                parts: {
                  include: {
                    category: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.avatar) {
      console.log("user情報の取得に失敗しました");
      socket.emit("error", { error: "user情報の取得に失敗しました" });
      socket.disconnect();
      return;
    }

    const avatarConfig = buildAvatarConfig(user.avatar);

    /* 
    噴水
      102.04078364086386,0,-49.19205738238992
    */
  //  噴水の手前あたりを初期位置に設定する。
    everyone[userId] = {
      id: userId,
      name: user!.name,
      position: {
        x: 102 + (Math.random() - 0.5) * 25,
        y: 0,
        z: -30 + (Math.random() - 0.5) * 5,
      },
      rotationY: Math.PI,
      avatarConfig,
      isWalking: false,
      color: generateUserColor(userId),
      voice: user.profile?.voice || 3,
    };

    io.to(SPACE_CHATROOM_ID).emit("receive-space-notification", {
      type: "join",
      players: [
        { name: everyone[userId]?.name, color: everyone[userId]?.color },
      ],
      content: "",
    });
    console.log(`${everyone[userId]?.name} さんが入室しました。`);
  } catch (error) {
    console.error(error);
  }

  // --------------------座標&回転のリアルタイム同期機能--------------------
  // A: 新規ユーザに対して、新規+既存接続ユーザーの情報を送信
  socket.emit("self-init", {
    self: everyone[userId],
    others: Object.fromEntries(
      Object.entries(everyone).filter(([id]) => id !== userId),
    ),
  });
  // B: 既存ユーザーに対して、新規ユーザーの情報を送信
  socket.broadcast.emit("someone-enter", { someone: everyone[userId] });

  // 移動情報を受信して他全員にブロードキャスト
  socket.on("self-move", (self) => {
    if (self.id) {
      everyone[self.id] = self;
      socket.broadcast.emit("someone-move", { someone: self });
    }
  });

  // --------------------アバター上メッセージ機能（全体チャット）--------------------
  // アバターの頭上に吹き出しで表示される一時的なメッセージ（DB保存なし）
  socket.on("send-avatar-message", ({ content }) => {
    const message = {
      content,
      timestamp: Date.now(),
      isDm: false, // 全体チャットなので false
    };

    // 全員にメッセージを配信（送信者自身も含む）
    io.emit("receive-avatar-message", { userId, message });

    // systemLog にも流す
    io.to(SPACE_CHATROOM_ID).emit("receive-space-notification", {
      type: "chat",
      players: [
        { name: everyone[userId]?.name, color: everyone[userId]?.color },
      ],
      content,
    });
    console.log(`[${everyone[userId]?.name}] アバターメッセージ: ${content}`);
  });

  // --------------------リアルタイムチャット機能(グローバル)--------------------
  socket.on("send-space-message", async ({ content }) => {
    try {
      await prisma.message.create({
        data: { senderId: userId, roomId: SPACE_CHATROOM_ID, content },
      });
      io.to(SPACE_CHATROOM_ID).emit("receive-space-message", {
        type: "chat",
        players: [
          { name: everyone[userId]?.name, color: everyone[userId]?.color },
        ],
        content,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // --------------------チャットルーム参加--------------------
  // ユーザーをチャットルームに参加させる。
  socket.on("join-chatRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(
      `[${everyone[userId]?.name}] チャットルーム参加 (roomId:${roomId})`,
    );
  });

  // --------------------メッセージ送信（DM）--------------------
  // 受信したメッセージをDBに登録し、チャットルームのメンバー全員に送信する。
  socket.on("send-message", async ({ roomId, content }) => {
    const message = await prisma.message.create({
      data: { content, roomId, senderId: userId },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    // ルームメンバーにメッセージを配信（DM履歴UIへの反映用）
    io.to(roomId).emit("receive-message", { message });

    /**
     * DM中のアバター頭上表示 & 音声再生のために receive-avatar-message を emit する。
     *
     * isDm: true を付けることで Players.tsx 側でDMメッセージと識別でき、
     * AvatarHtml / OtherAvatarHtml で吹き出しを緑色で表示できる。
     * receive-avatar-message を再利用することで、既存の
     * handleAvatarMessage（吹き出し表示・3秒後消去・音声再生）がそのまま動く。
     */
    io.to(roomId).emit("receive-avatar-message", {
      userId,
      message: {
        content,
        timestamp: Date.now(),
        isDm: true, // DM由来であることを示すフラグ
      },
    });

    console.log(
      `[${everyone[userId]?.name}] DMメッセージ (roomId:${roomId}): ${content}`,
    );
  });

  // --------------------話しかける--------------------
  // 相手のプライベートルームに話しかけリクエストを送信する
  socket.on("send-chatRequest", ({ receiverId }) => {
    io.to(receiverId).emit("receive-chatRequest", {
      senderId: userId,
      senderName: everyone[userId]?.name,
    });
    console.log(
      `[${everyone[userId]?.name}] → [${everyone[receiverId]?.name}] 話しかけリクエスト`,
    );
  });

  // --------------------話しかけをキャンセル--------------------
  socket.on("send-chatCancel", ({ receiverId }) => {
    io.to(receiverId).emit("receive-chatCancel", {
      senderId: userId,
    });

    console.log(
      `[${everyone[userId]?.name}] → [${everyone[receiverId]?.name}] 話しかけキャンセル`,
    );
  });

  // --------------------話しかけに応答する(許可/拒否）--------------------
  // 呼び出し側に返答を送信する（canTalk=true の場合は roomId も渡す）
  socket.on("send-chatResponse", ({ receiverId, canTalk, roomId }) => {
    io.to(receiverId).emit("receive-chatResponse", {
      senderId: userId,
      senderName: everyone[userId]?.name,
      canTalk,
      roomId,
    });

    // 会話開始のとき systemLog に「会話を開始しました」を流す
    if (canTalk && roomId) {
      io.to(SPACE_CHATROOM_ID).emit("receive-space-notification", {
        type: "start-dm",
        players: [
          { name: everyone[userId]?.name, color: everyone[userId]?.color },
          {
            name: everyone[receiverId]?.name,
            color: everyone[receiverId]?.color,
          },
        ],
        content: "",
      });
    }
    console.log(
      `[${everyone[userId]?.name}] → [${everyone[receiverId]?.name}] 応答: ${canTalk ? "許可" : "拒否"}`,
    );
  });

  // --------------------会話を終了する--------------------
  // ルームメンバー全員に hang-up を emit する（双方の dmState がクリアされる）
  socket.on("hang-up", ({ roomId, receiverId }) => {
    io.to(roomId).emit("hang-up");

    // systemLog に「会話を終了しました」を流す
    io.to(SPACE_CHATROOM_ID).emit("receive-space-notification", {
      type: "finish-dm",
      players: [
        { name: everyone[userId]?.name, color: everyone[userId]?.color },
        {
          name: everyone[receiverId]?.name,
          color: everyone[receiverId]?.color,
        },
      ],
      content: "",
    });
    console.log(`会話終了 (roomId:${roomId})`);
  });

  // --------------------退出処理--------------------
  socket.on("disconnect", () => {
    const notification = `${everyone[userId]?.name} さんが退出しました。`;
    io.to(SPACE_CHATROOM_ID).emit("receive-space-notification", {
      type: "leave",
      players: [
        { name: everyone[userId]?.name, color: everyone[userId]?.color },
      ],
      content: "",
    });
    delete everyone[userId];
    socket.broadcast.emit("someone-leave", { someoneId: userId });
    console.log(notification);
  });
});

app.get("/", (_req, res) => {
  res.send("<h1>HALLO/server</h1>");
});

const PORT = 5000;
const hostname = os.hostname(); // ホスト名を取得

server.listen(PORT, "0.0.0.0", () => {
  console.log(`
   \x1b[32m✓\x1b[0m WebSocket server is running ...

  🛢️\x1b[36m\x1b[1m：http://${hostname}:${PORT}\x1b[0m

   \x1b[32m\x1b[1m▲ Express 17.2.3\x1b[0m
   - Local:        http://localhost:${PORT}
   - Network:      http://${hostname}:${PORT}
   - Environments: .env
  `);
});
