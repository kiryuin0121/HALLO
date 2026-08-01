import { createAuthClient } from "better-auth/react";
import { APP_URL } from "./env";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: APP_URL,
});
export const { signIn, signUp, signOut, useSession } = createAuthClient();
export type Session = typeof authClient.$Infer.Session;