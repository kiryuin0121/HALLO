import { AvatarConfig } from "./avatar";

export type Postion = {
  x: number;
  y: number;
  z: number;
};

export type UserId = string;

export type UserData = {
  id: UserId;
  name: string;
  position: Postion;
  rotationY: number;
  avatarConfig: AvatarConfig;
  isWalking?: boolean;
  color?: string;
  voice?: number;
  message?: {
    content: string;
    timestamp: number;
    /** DMメッセージかどうか（trueのとき吹き出しを緑色で表示） */
    isDm?: boolean;
  };
};