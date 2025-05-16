import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bildeholder.art',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
