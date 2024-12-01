/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
