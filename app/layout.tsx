import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shift Japan Insight | 日本転職・移住専門分析レポート',
  description: '日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門プラットフォーム',
  keywords: '日本転職,移住,キャリア,ビジネス,データ分析,レポート',
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
