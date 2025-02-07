// import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  experimental: {
    optimizePackageImports: ["reaflow"]
  },
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true, layers: true };

    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }

    return config;
  }
};

export default nextConfig;
