/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/icon', permanent: false },
    ];
  },
};

module.exports = nextConfig;
