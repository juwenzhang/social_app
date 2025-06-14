import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 允许来自于外部的图片
    remotePatterns: [
      {
        // 都是可控的呐
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // 开启 swc 压缩
  // swcMinify: true,
};

export default nextConfig;