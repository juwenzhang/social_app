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
  webpack: (config, { dev }) => {
    if (dev) {
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization = {
        ...config.optimization,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ],
      };
    }
    return config;
  },
};

export default nextConfig;