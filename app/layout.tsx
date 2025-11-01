import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://shiftjapaninsight.com'),
  title: {
    default: 'Shift Japan Insight | 日本転職・移住専門分析レポート',
    template: '%s | Shift Japan Insight',
  },
  description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門プラットフォーム',
  keywords: ['日本転職', '移住', 'キャリア', 'ビジネス', 'データ分析', 'レポート', '日本就職', '外国人在留', 'ビザ', '就労ビザ'],
  authors: [{ name: 'Shift Japan Insight' }],
  creator: 'Shift Japan Insight',
  publisher: 'Shift Japan Insight',
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
    description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門プラットフォーム',
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
    title: 'Shift Japan Insight | 日本転職・移住専門分析レポート',
    description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門プラットフォーム',
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
  icons: {
    icon: '/shiftjapan-favi.jpg',
    apple: '/shiftjapan-favi.jpg',
  },
  verification: {
    // Google Search Console verification code (optional)
    // google: 'your-verification-code',
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
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
