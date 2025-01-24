import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6gy9systudbmcbju.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gund4pvmy3.ufs.sh",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
