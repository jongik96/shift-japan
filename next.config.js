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
  // favicon 요청 리다이렉트 설정 제거 - redirects가 Edge Runtime에서 문제를 일으킬 수 있음
  // 대신 public 폴더에 파일이 있으면 자동으로 서빙됨
}

module.exports = nextConfig
