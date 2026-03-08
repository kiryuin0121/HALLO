import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://192.168.40.26:3000",
});
export const { signIn, signUp, signOut, useSession } = createAuthClient();
export type Session = typeof authClient.$Infer.Session;

// "http://localhost:3000"
// "http://192.168.40.26:3000"
// http://10.77.113.156:3000
// http://172.20.10.2:3000