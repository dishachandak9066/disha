import type { NextConfig } from "next";

// Use the env var in production (Vercel), fallback to localhost in development
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/books/:path*",
        destination: `${BACKEND_URL}/api/books/:path*`,
      },
      {
        source: "/api/library/:path*",
        destination: `${BACKEND_URL}/api/library/:path*`,
      },
      {
        source: "/api/history/:path*",
        destination: `${BACKEND_URL}/api/history/:path*`,
      },
      {
        source: "/api/recommendations/:path*",
        destination: `${BACKEND_URL}/api/recommendations/:path*`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${BACKEND_URL}/api/dashboard/:path*`,
      },
      {
        source: "/api/theme/:path*",
        destination: `${BACKEND_URL}/api/theme/:path*`,
      },
      {
        source: "/api/translate/:path*",
        destination: `${BACKEND_URL}/api/translate/:path*`,
      },
      {
        source: "/api/reading-progress/:path*",
        destination: `${BACKEND_URL}/api/reading-progress/:path*`,
      },
      {
        source: "/api/gutendex/:path*",
        destination: `${BACKEND_URL}/api/gutendex/:path*`,
      },
      {
        source: "/api/seed-books/:path*",
        destination: `${BACKEND_URL}/api/seed-books/:path*`,
      },
      {
        source: "/api/init-db/:path*",
        destination: `${BACKEND_URL}/api/init-db/:path*`,
      },
    ];
  },
};

export default nextConfig;
