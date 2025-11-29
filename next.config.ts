import type { NextConfig } from 'next'

/**
 * Next.js 15 Configuration
 *
 * Key settings:
 * - App Router (default in Next.js 15)
 * - React 19 with Server Components
 * - Strict mode for development
 * - Image optimization for Backblaze B2
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Enable typed routes for better type safety
  typedRoutes: true,

  // Image optimization configuration
  images: {
    // Remote patterns for Backblaze B2
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-004.backblazeb2.com',
        pathname: '/kline-martin-photos/**',
      },
      {
        protocol: 'https',
        hostname: '*.backblazeb2.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Image formats to optimize
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 week
    minimumCacheTTL: 604800,
  },

  // Environment variables available at build time
  env: {
    // Add any build-time env vars here if needed
  },

  // Redirects (add auth redirects later)
  async redirects() {
    return []
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
