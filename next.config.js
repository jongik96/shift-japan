/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure trailing slash is handled correctly for Vercel
  trailingSlash: false,
  // Ensure proper routing
  reactStrictMode: true,
  // NOTE: i18n config in next.config.js only works with Pages Router (pages/ directory)
  // This project uses App Router (app/ directory), so middleware is required for i18n routing
  // Middleware with Node.js runtime handles all locale routing and redirects
}

module.exports = nextConfig
