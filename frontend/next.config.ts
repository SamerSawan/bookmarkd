import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'books.google.com',
      },
      {
        hostname: 'covers.openlibrary.org'
      },
      {
        hostname: 'via.placeholder.com'
      }
    ],
  },
};

export default nextConfig;
