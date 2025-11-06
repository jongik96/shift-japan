import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import AdSenseInit from '@/components/AdSenseInit'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://shiftjapaninsight.com'),
  title: {
    default: 'Shift Japan Insight | 日本転職・移住専門分析レポート',
    template: '%s | Shift Japan Insight',
  },
  description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門ブログプラットフォーム',
  keywords: ['日本転職', '日本移住', 'キャリア', 'ビジネス', 'データ分析', 'Japan', 'Career', 'Migration'],
  authors: [{ name: 'Shift Japan Insight' }],
  creator: 'Shift Japan Insight',
  publisher: 'Shift Japan Insight',
  icons: {
    icon: '/shiftjapan-favi.png',
    shortcut: '/shiftjapan-favi.png',
    apple: '/shiftjapan-favi.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://shiftjapaninsight.com',
    siteName: 'Shift Japan Insight',
    title: 'Shift Japan Insight | 日本転職・移住専門分析レポート',
    description: '日本への移住、転職、キャリアに関する深い洞察과 데이터 분석을 제공하는 전문 블로그 플랫폼',
    images: [
      {
        url: '/shiftjapan-og.png',
        width: 1200,
        height: 630,
        alt: 'Shift Japan Insight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shift Japan Insight',
    description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門ブログプラットフォーム',
    images: ['/shiftjapan-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'kxYDEGmU5I0gGHfz2Xg9ZpI68S9LuPuORnlUeEQ2I04',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AdSenseInit />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

