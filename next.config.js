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
  // Edge Runtime 호환성: webpack 설정 제거 (Edge Runtime과 충돌 가능)
}

module.exports = nextConfig
