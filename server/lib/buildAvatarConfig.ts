import { PartsCategory } from "../generated/prisma/enums.js";
import type { AvatarConfig, AvatarWithRelations } from "../types/user.js";

export const buildAvatarConfig = (avatar: AvatarWithRelations) => {
  // 空っぽのavatarConfigを作成する。
  const avatarConfig: AvatarConfig = {};
  for (const categoryName of Object.values(PartsCategory)) {
    avatarConfig[categoryName] = {
      parts: null,
      color: null,
    };
  }

  // avatarConfigに装着しているパーツを設定する。
  const avatarPartsList = avatar.avatarParts; //アバターが装着しているパーツ一覧
  for (const avatarParts of avatarPartsList) {
    const categoryName = avatarParts.parts.category.name;
    avatarConfig[categoryName] = {
      parts: avatarParts.parts,
      color: avatarParts.color,
    };
  }

  return avatarConfig;
};
