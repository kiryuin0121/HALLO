import os from "os";
import type { NextConfig } from "next";

const hostname = os.hostname();
const port = 3000;

console.log(`
  🌐\x1b[36m\x1b[1m：http://${hostname}:${port}\x1b[0m
  📱\x1b[36m\x1b[1m：http://172.20.10.2:3000\x1b[0m
`);

const nextConfig: NextConfig = {
  // allowedDevOrigins: [hostname, `${hostname}.local`],
};

export default nextConfig;