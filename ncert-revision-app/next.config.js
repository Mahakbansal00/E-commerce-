/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/ncert-revision-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ncert-revision-app/' : '',
};

module.exports = nextConfig;
