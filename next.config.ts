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
  swcMinify: true,
  // 支持 web worker
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.ts$/,
        use: { loader: 'worker-loader' },
        exclude: /node_modules/,
      });
      config.output.globalObject = 'self';
    }
    return config;
  },
};

export default nextConfig;