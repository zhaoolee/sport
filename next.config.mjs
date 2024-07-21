/** @type {import('next').NextConfig} */
const nextConfig = {
  // support next export
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
