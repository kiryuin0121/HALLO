import { Prisma } from "@/generated/prisma/client";

export const CampusLabel = {
  osaka: "HAl大阪",
  tokyo: "HAl東京",
  nagoya: "HAl名古屋",
} as const;

export const MajorLabel = {
  game: "ゲーム",
  cg_design_anime: "CG・デザイン・アニメ",
  music: "ミュージック",
  cardesign: "カーデザイン",
  it_web_ai: "IT・WEB・AI",
} as const;

export const GenderLabel = {
  male: "男性",
  female: "女性",
  other: "その他",
} as const;

export const MBTILabel = {
  ISTJ: "ISTJ（管理者）",
  ISFJ: "ISFJ（擁護者）",
  INFJ: "INFJ（提唱者）",
  INTJ: "INTJ（建築家）",
  ISTP: "ISTP（巨匠）",
  ISFP: "ISFP（冒険家）",
  INFP: "INFP（仲介者）",
  INTP: "INTP（論理学者）",
  ESTP: "ESTP（企業家）",
  ESFP: "ESFP（エンターテイナー）",
  ENFP: "ENFP（運動家）",
  ENTP: "ENTP（討論者）",
  ESTJ: "ESTJ（幹部）",
  ESFJ: "ESFJ（領事）",
  ENFJ: "ENFJ（主人公）",
  ENTJ: "ENTJ（指揮官）",
} as const;

export type Grade = 1|2|3|4;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    profile: true;
    avatar: {
      include: {
        avatarParts: {
          include: {
            parts: {
              include: {
                category: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type UserWithProfile = Prisma.UserGetPayload<{
  include:{profile:true}
}>