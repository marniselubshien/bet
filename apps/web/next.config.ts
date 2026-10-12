import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async redirects() {
    return [
      { source: '/', destination: '/casino', permanent: false },
      { source: '/sign-in', destination: '/auth/sign-in', permanent: false },
      { source: '/sign-up', destination: '/auth/sign-up', permanent: false },
      { source: '/login', destination: '/auth/sign-in', permanent: false },
      { source: '/signup', destination: '/auth/sign-up', permanent: false },
      { source: '/sports', destination: '/casino', permanent: false },
      { source: '/promotions', destination: '/casino/promotions', permanent: false },
      { source: '/free-money', destination: '/casino/free-money', permanent: false },
      { source: '/wallet', destination: '/casino/wallet', permanent: false },
      { source: '/statistics', destination: '/casino/statistics', permanent: false },
      { source: '/transactions', destination: '/casino/transactions', permanent: false },
      { source: '/game-history', destination: '/casino/game-history', permanent: false },
      { source: '/settings', destination: '/casino/settings', permanent: false },
      { source: '/announcements', destination: '/casino/announcements', permanent: false },
      { source: '/support', destination: '/casino/support', permanent: false },
      { source: '/account', destination: '/casino/account', permanent: false },
      { source: '/chat', destination: '/casino/support', permanent: false },
      { source: '/vip', destination: '/casino/vip', permanent: false },
      { source: '/casino/home', destination: '/casino', permanent: false },
      { source: '/deposit', destination: '/casino/wallet/deposit', permanent: false },
      { source: '/withdraw', destination: '/casino/wallet/withdraw', permanent: false },
      { source: '/deposit-history', destination: '/casino/wallet/deposit-history', permanent: false },
      { source: '/withdrawal-history', destination: '/casino/wallet/withdrawal-history', permanent: false },
      { source: '/casino/deposit', destination: '/casino/wallet/deposit', permanent: false },
      { source: '/casino/withdraw', destination: '/casino/wallet/withdraw', permanent: false },
      { source: '/casino/deposit-history', destination: '/casino/wallet/deposit-history', permanent: false },
      { source: '/casino/withdrawal-history', destination: '/casino/wallet/withdrawal-history', permanent: false },
      { source: '/casino/withdraw-history', destination: '/casino/wallet/withdrawal-history', permanent: false },
    ];
  },
}

export default nextConfig
