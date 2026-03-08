import { io } from "socket.io-client";

export const initializeSocket = (url: string, userId: string) => {
  const socket = io(url, { auth: { token: userId } });
  return socket;
};
