import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/bejugamvarun.github.io',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
