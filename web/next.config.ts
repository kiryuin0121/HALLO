import os from "os";
import type { NextConfig } from "next";

const hostname = os.hostname();
const port = 3000;
// IPアドレスは web/.env の NEXT_PUBLIC_HOST に集約
const appUrl = `http://${process.env.NEXT_PUBLIC_HOST || "localhost"}:${port}`;

console.log(`
  🌐\x1b[36m\x1b[1m：http://${hostname}:${port}\x1b[0m
  📱\x1b[36m\x1b[1m：${appUrl}\x1b[0m
`);

const nextConfig: NextConfig = {
  // allowedDevOrigins: [hostname, `${hostname}.local`],
};

export default nextConfig;