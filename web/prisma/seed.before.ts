import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "横畑希龍",
    email: "ohs50348@ohs.hal.ac.jp",
    profile: {
      create: {
        campus: "osaka",
        major: "it_web_ai",
        grade: 1,
        gender: "male",
        mbti: "INTJ",
        bio: "React/Next.jsを用いたフロントエンドの実装が得意です。",
      },
    },
    avatar: {
      create: {
        config: JSON.stringify({ color: "#00008b" })
      },
    },
  },
  {
    name: "きりたん",
    email: "kiryuin0121@gmail.com",
    profile: {
      create: {
        campus: "tokyo",
        major: "it_web_ai",
        grade: 2,
        gender: "other",
        mbti: "INFJ",
        bio: "Expressを用いたバックエンドの実装が得意です。",
      },
    },
    avatar: {
      create: {
        config: JSON.stringify({ color: "#00ff00" })
      },
    },
  },
  {
    name: "kill",
    email: "kiryuin01212@gmail.com",
    profile: {
      create: {
        campus: "nagoya",
        major: "it_web_ai",
        grade: 3,
        gender: "female",
        mbti: "INTP",
        bio: "Motionを用いたアニメーションの実装が得意です。",
      },
    },
    avatar: {
      create: {
        config: JSON.stringify({ color: "#ff007f" })
      },
    },
  },
];

export async function main() {
  try {
    for (const user of userData) {
      await prisma.user.create({
        data: user,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

main();
