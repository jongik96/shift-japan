import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default async function ReportsPage() {
  // TODO: Fetch from Supabase
  const reports = []

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">レポート一覧</h1>
          <p className="text-lg text-gray-600">
            データに基づく深い分析レポートをご覧いただけます
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>すべてのカテゴリー</option>
            <option>移住・生活</option>
            <option>キャリア・ビジネス</option>
            <option>金融・投資</option>
            <option>税務・法令</option>
            <option>文化・社会</option>
            <option>データ分析</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>並び替え: 新着順</option>
            <option>人気順</option>
            <option>タイトル順</option>
          </select>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-8">まだレポートがありません</p>
            <p className="text-sm text-gray-500">
              管理画面から最初のレポートを作成してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report: any) => (
              <Link
                key={report.id}
                href={`/report/${report.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition group"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {/* Image will be here */}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {report.categories?.slice(0, 2).map((cat: string) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {report.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{report.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>読む時間: 5分</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
