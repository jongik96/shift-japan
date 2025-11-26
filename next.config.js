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
  // Edge Runtime 최적화 및 로깅
  webpack: (config, { isServer, webpack }) => {
    // 빌드 시 __dirname 사용 감지 및 로깅
    if (!isServer) {
      // 클라이언트 빌드에서는 Node.js 모듈 사용 방지
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    
    // __dirname 사용을 감지하고 빌드 시 경고
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = typeof originalEntry === 'function' 
        ? await originalEntry() 
        : originalEntry
      console.log('=== Webpack Entry Points ===')
      console.log('Entries:', Object.keys(entries))
      return entries
    }
    
    return config
  },
  // 빌드 시 로그 출력
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

// 빌드 시작 시 __dirname 상태 확인
console.log('=== Next.js Config 로드 ===')
console.log('__dirname 타입:', typeof __dirname)
console.log('__dirname 값:', typeof __dirname !== 'undefined' ? __dirname : 'undefined')
console.log('process.cwd():', process.cwd())

module.exports = nextConfig
