import { Parts, PartsCategory, Prisma } from "@/generated/prisma/client";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parts: true;
    defaultParts: true;
    colorPalette: true;
  };
}>;
// avatarConfig
export type AvatarConfigValue = {
  parts: Parts | null;
  color: string | null;
};
export type AvatarConfig = Partial<Record<PartsCategory, AvatarConfigValue>>;

export const CategoryLabel = {
  head: "あたま",
  hair: "かみ",
  face: "かお",
  eyes: "め",
  eyebrows: "まゆげ",
  nose: "はな",
  facial_hair: "ひげ",
  glasses: "めがね",
  hat: "ぼうし",
  top: "トップス",
  bottom: "パンツ",
  shoes: "くつ",
  accessories: "アクセサリー",
  voice:"ボイス"
} as const;
