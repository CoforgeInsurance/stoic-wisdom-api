import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Skip build-time generation of dynamic routes
  // They will be client-side rendered instead
  trailingSlash: true,
};

export default nextConfig;
