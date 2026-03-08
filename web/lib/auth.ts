import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import os from "os";
// If your Prisma file is located elsewhere, you can change the path

// 参考資料
// https://www.better-auth.com/docs/reference/options#emailandpassword
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    //データーベース
    provider: "postgresql",
  }),
  emailAndPassword: {
    //電子メールとパスワード認証
    enabled: true, //電子メールとパスワードの認証を有効にする
    disableSignUp: false, //メールアドレスとパスワードによるサインアップを無効にする
    requireEmailVerification: false, //セッションを作成する前にメールの確認が必要か
    minPasswordLength: 8, //パスワードの最小文字列
    maxPasswordLength: 128, //パスワードの最大文字列
    autoSignIn: true, //サインアップ後にユーザーを自動的にサインインする
    password: {
      //カスタムパスワードハッシュおよび検証関数
      hash: async (password) => {
        //パスワードをハッシュ化する
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        //パスワード(ハッシュ値)を検証する
        return await bcrypt.compare(password, hash);
      },
    },
  },
  plugins: [nextCookies()],
  secret: process.env.BETTER_AUTH_SECRET!, //暗号化、署名、ハッシュ化に使用される秘密鍵
  baseURL: `http://${os.hostname}:${3000}`, //アプリケーションサーバーがホストされているルートUR
  basePath: "/api/auth", //etter Authルートがマウントされるパスです。
  user: {
    //ユーザー関連の設定
    modelName: "user",
    changeEmail: {
      //メールを変更するための設定
      enabled: true,
    },
    deleteUser: {
      //ユーザーを削除するための設定
      enabled: true,
    },
  },
  session: {
    //セッション関連の設定
    modelName: "session",
    expiresIn: 60 * 60 * 24 * 7, //セッショントークンの有効期限（秒）（デフォルト: 604800- 7日）
    updateAge: 60 * 60 * 24, //セッションを更新する頻度（秒単位）（デフォルト: 86400- 1 日）
    storeSessionInDatabase: false, // セッションをCookieに加えてDBにも保存するか
    preserveSessionInDatabase: false, // セッションがCookieから削除されたときにDBからも削除するか
    cookieCache: {
      //Cookieでセッションのキャッシュを有効にする
      enabled: false,
    },
  },
});
