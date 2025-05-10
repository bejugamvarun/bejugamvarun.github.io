import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  basePath: isProd ? '/bejugamvarun.github.io' : '',
  images: {
    unoptimized: true,
  },
  ...(isProd && { output: 'export' }),
  trailingSlash: true,
};

export default nextConfig;
