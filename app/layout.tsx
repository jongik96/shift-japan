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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default to Japanese, but this will be dynamically set by middleware/client if needed
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
