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
  trailingSlash: false,
  reactStrictMode: true,
  // Edge Runtime 최적화
  experimental: {
    // Edge Runtime 안정성 향상
  },
  // favicon 요청 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/shiftjapan-favi.png',
        permanent: true,
      },
      {
        source: '/favicon.png',
        destination: '/shiftjapan-favi.png',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
