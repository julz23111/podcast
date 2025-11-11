import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to complete even if there are ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow production builds to complete even if there are TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // We use plain <img> on Cloudflare Pages; disable Next Image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
