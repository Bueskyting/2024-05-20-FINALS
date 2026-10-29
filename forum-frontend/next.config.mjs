/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const nextConfig = {
  reactStrictMode: false,
  // Forward every /api request to the Express backend (forum-backend)
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
