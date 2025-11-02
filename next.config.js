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
}

module.exports = nextConfig
