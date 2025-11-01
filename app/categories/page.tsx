import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CategoriesPage() {
  const categories = [
    {
      slug: 'residence',
      title: '移住・生活',
      icon: '🏠',
      description: 'ビザ、住居、医療、教育など移住生活に必要な情報',
      color: 'bg-blue-500',
    },
    {
      slug: 'career',
      title: 'キャリア・ビジネス',
      icon: '💼',
      description: '転職、給与、昇進、起業などキャリア構築に関する分析',
      color: 'bg-green-500',
    },
    {
      slug: 'finance',
      title: '金融・投資',
      icon: '💰',
      description: 'NISA、iDeCo、年金、節税など資産形成戦略',
      color: 'bg-yellow-500',
    },
    {
      slug: 'tax',
      title: '税務・法令',
      icon: '📜',
      description: '所得税、住民税、社会保険、最新法令の解説',
      color: 'bg-purple-500',
    },
    {
      slug: 'culture',
      title: '文化・社会',
      icon: '🎌',
      description: '日本の働き方、コミュニケーション、社会制度',
      color: 'bg-red-500',
    },
    {
      slug: 'data',
      title: 'データ分析',
      icon: '📊',
      description: '統計、トレンド、市場調査の可視化レポート',
      color: 'bg-indigo-500',
    },
  ]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">カテゴリー一覧</h1>
          <p className="text-lg text-gray-600">
            興味のあるトピックを選択して、関連レポートを探索してください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition group"
            >
              <div className={`${category.color} p-8 text-center`}>
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>レポートを見る</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
