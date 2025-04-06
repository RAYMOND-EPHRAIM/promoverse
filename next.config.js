/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ THIS is the key
  },
};

module.exports = nextConfig;
