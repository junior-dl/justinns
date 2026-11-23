import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.storage.**.aws.neon.tech" }],
  },
};

export default nextConfig;
