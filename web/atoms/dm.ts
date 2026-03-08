import { atom } from "jotai";

type DmState =
  | { status: "idle" }
  | { status: "pending"; userId: string; userName: string }
  | { status: "requested"; userId: string; userName: string }
  | {
      status: "talking";
      userId: string;
      userName: string;
      roomId: string;
    };

export const dmStateAtom = atom<DmState>({ status: "idle" });


export type DmToast = {
  code: number;
  label: string;    
  message: string; 
} | null;

export const dmToastAtom = atom<DmToast>(null);