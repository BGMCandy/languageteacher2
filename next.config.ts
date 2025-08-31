import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'localhost:3001', 
        'localhost:3006', 
        '127.0.0.1:3000', 
        '127.0.0.1:3001',
        '127.0.0.1:3006',
        'languageteacher.io',
        'www.languageteacher.io'
      ],
    },
  },
};

export default nextConfig;
