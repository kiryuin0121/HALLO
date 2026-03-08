
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";


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
        mbti: "INFJ",
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
        mbti: "INTJ",
        bio: "Expressを用いたバックエンドの実装が得意です。",
      },
    },
    avatar: {
      create: {
        config: JSON.stringify({ color: "#4b0082" })
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
    const user = await prisma.user.findMany();
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

main();
