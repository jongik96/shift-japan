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
  // Middleware handles all redirects, so no redirects() needed here
}

module.exports = nextConfig
