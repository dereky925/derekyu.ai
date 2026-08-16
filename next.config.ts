import type { NextConfig } from "next";
import { remoteImageHosts } from "./lib/media";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...remoteImageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      {
        protocol: "https",
        hostname: "**.cloudflarestream.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
};

export default nextConfig;
