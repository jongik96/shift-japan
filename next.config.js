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
  // 루트 경로를 /ja로 리다이렉트 (middleware에서 처리하면 __dirname 에러 발생)
  // redirects는 Edge Runtime에서 안전하게 처리됨
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ja',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
