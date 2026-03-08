export const CampusValues = ["osaka", "tokyo", "nagoya"] as const;
export type Campus = (typeof CampusValues)[number];

export const MajorValues = [
  "game",
  "cg_design_anime",
  "music",
  "cardesign",
  "it_web_ai",
] as const;
export type Major = (typeof MajorValues)[number];

export const GenderValues = ["male", "female", "other"] as const;
export type Gender = (typeof GenderValues)[number];

export const MBTIValues = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
] as const;
export type MBTI = (typeof MBTIValues)[number];

export const PartsCategoryValues = [
  "head",
  "hair",
  "face",
  "eyes",
  "eyebrows",
  "nose",
  "facial_hair",
  "glasses",
  "hat",
  "top",
  "bottom",
  "shoes",
  "accessories",
] as const;

export type PartsCategory = (typeof PartsCategoryValues)[number];

export const PaletteNameValues = ["skin", "hair", "clothers"] as const;
export type PaletteName = (typeof PaletteNameValues)[number];

export const ChatStyleValues = ["direct", "group", "space"] as const;
export type ChatStyle = (typeof ChatStyleValues)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  campus: Campus;
  major: Major;
  grade: number; // 1-4
  gender: Gender;
  mbti: MBTI;
  voice: number;
  hometown:string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Avatar = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AvatarParts = {
  id: string;
  avatarId: string;
  partsId: string;
  color?: string | null;
};

export type Category = {
  id: string;
  name: PartsCategory;
  removable: boolean;
  serial: number;
  defaultPartsId?: string | null;
};

export type Parts = {
  id: string;
  name: string;
  image: string;
  model: string;
  categoryId: string;
};

export type ColorPalette = {
  id: string;
  name: PaletteName;
  colors: string[];
  categoryId: string;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  roomId: string;
};

export type ChatRoom = {
  id: string;
  chatStyle: ChatStyle;
  createdAt: Date;
};

export type ChatMember = {
  id: string;
  memberId: string;
  roomId: string;
};
