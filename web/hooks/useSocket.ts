"use client";

import { socketAtom } from "@/atoms/socket";
import { useAtomValue } from "jotai";

export const useSocket = () => {
  const socket = useAtomValue(socketAtom);
  return socket;
};
