/*
  IPアドレス/ホスト名に依存する値はここに集約する。
  変更するときは web/.env の NEXT_PUBLIC_HOST を書き換えるだけでよい。
    例) NEXT_PUBLIC_HOST=192.168.40.26 / localhost / 172.20.10.2
*/
export const HOST = process.env.NEXT_PUBLIC_HOST || "localhost";

const APP_PORT = 3000; // Next.js
const SOCKET_PORT = 5000; // socket.io

// Next.js(アプリケーションサーバー)のルートURL
export const APP_URL = `http://${HOST}:${APP_PORT}`;
// WebSocket(socket.io)サーバーのURL
export const SOCKET_URL = `http://${HOST}:${SOCKET_PORT}`;
