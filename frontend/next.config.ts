import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable SSR
  // Removed 'images.unoptimized' to use Next.js image optimization
  // Keep trailing slashes for better routing
  trailingSlash: true,
};

export default nextConfig;
