import type {
  Parts,
  PartsCategory,
  Prisma,
} from "../generated/prisma/client.js";

export type AvatarWithRelations = Prisma.AvatarGetPayload<{
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
}>;
export type AvatarConfigValue = {
  parts: Parts | null;
  color: string | null;
};
export type AvatarConfig = Partial<Record<PartsCategory, AvatarConfigValue>>;

export type Postion = {
  x:number,
  y:number, 
  z:number
}
export type UserId = string;
export type UserData = {
  id:UserId,
  name:string,
  position:Postion,
  rotationY:number,
  avatarConfig:AvatarConfig,
  isWalking?:boolean,
  color?:string,
  voice?:number
}
