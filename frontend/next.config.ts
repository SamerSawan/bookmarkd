import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'books.google.com',
      },
      {
        hostname: 'covers.openlibrary.org'
      }
    ],
  },
};

export default nextConfig;
