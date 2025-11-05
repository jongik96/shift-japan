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
  // redirects 함수 제거 - Next.js 14.0.4에서 Edge Runtime 처리 시 __dirname 사용 가능성
  // 대신 app/page.tsx에서 클라이언트 리다이렉트 사용
}

module.exports = nextConfig
