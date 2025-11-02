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
  // Redirect all root paths to /ja locale
  async redirects() {
    return [
      {
        source: '/:path((?!ja|en|ko|_next|api|favicon.ico|robots.txt|sitemap.xml).*)',
        destination: '/ja/:path*',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
