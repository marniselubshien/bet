import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async redirects() {
    return [
      { source: '/sign-in', destination: '/auth/sign-in', permanent: false },
      { source: '/sign-up', destination: '/auth/sign-up', permanent: false },
      { source: '/casino/home', destination: '/casino', permanent: false },
    ];
  },
}

export default nextConfig
