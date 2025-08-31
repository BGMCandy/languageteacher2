import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@supabase/ssr'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3006', '127.0.0.1:3000', '127.0.0.1:3006'],
    },
  },
};

export default nextConfig;
