import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const categoryMap: { [key: string]: string } = {
  residence: '移住・生活',
  career: 'キャリア・ビジネス',
  finance: '金融・投資',
  tax: '税務・法令',
  culture: '文化・社会',
  data: 'データ分析',
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryName = categoryMap[params.slug]
  
  if (!categoryName) {
    return {
      title: 'カテゴリーが見つかりません',
    }
  }

  return {
    title: `${categoryName} | Shift Japan Insight`,
    description: `${categoryName}に関する専門レポート一覧`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = categoryMap[params.slug]
  
  if (!categoryName) {
    notFound()
  }

  const { data: reports } = await supabase
    .from('insight_posts')
    .select('id, slug, title, excerpt, main_image, categories, created_at')
    .contains('categories', [categoryName])
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <nav className="mb-6">
            <Link href="/categories" className="text-blue-600 hover:text-blue-700">
              ← カテゴリー一覧に戻る
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600">
            {categoryName}に関する専門分析レポート
          </p>
        </div>

        {reports && reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition group"
              >
                {report.main_image && (
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={report.main_image}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
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
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(report.created_at).toLocaleDateString('ja-JP')}</span>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                      続きを読む →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-8">このカテゴリーにはまだレポートがありません</p>
            <Link
              href="/reports"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              すべてのレポートを見る →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
