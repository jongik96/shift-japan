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
  // Edge Runtime 호환성: webpack 설정으로 JSON 파일 처리 최적화
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.json': ['.json'],
    }
    return config
  },
}

module.exports = nextConfig
