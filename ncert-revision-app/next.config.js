const nextConfig = {
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/ncert-revision-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ncert-revision-app/' : '',
};

export default nextConfig;
