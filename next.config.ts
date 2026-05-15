import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healix-nu.vercel.app";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://randomuser.me https://avatars.githubusercontent.com https://*.basemaps.cartocdn.com https://unpkg.com https://api.qrserver.com https://*.supabase.co",
      "media-src 'self' data: blob: https://www.w3schools.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://healix-biolabs.onrender.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

// Long-lived cache for static assets
const staticCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Image optimisation — serve WebP/AVIF, cache aggressively
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 1 day
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  // Enable gzip / brotli compression
  compress: true,

  // Power-user: keep source maps off in prod for smaller bundles
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      // Security headers for every route
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Long-lived caching for Next.js static chunks
      {
        source: "/_next/static/(.*)",
        headers: staticCacheHeaders,
      },
      // Long-lived caching for public images & fonts
      {
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2)",
        headers: staticCacheHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Canonical redirect: non-www → www handled by Vercel, but keep these for self-hosting
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
