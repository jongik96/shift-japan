import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">サービスについて</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🇯🇵 Shift Japan Insight とは</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shift Japan Insight は、日本への移住、転職、キャリア構築を検討している方々のために、
              データに基づく深い洞察と専門的な分析を提供するプラットフォームです。
            </p>
            <p className="text-gray-700 leading-relaxed">
              表面的な情報ではなく、実際のデータ、統計、専門家の視点を通じて、
              日本での成功を支援することを目指しています。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">私たちのミッション</h2>
            <p className="text-gray-700 leading-relaxed">
              日本での移住・転職を検討するすべての人が、信頼できる情報に基づいて
              意思決定できるよう、専門的で実用的なコンテンツを提供します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">コンテンツの特徴</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>データ駆動:</strong> 統計やトレンドデータに基づく分析</li>
              <li><strong>実践的:</strong> 実際に活用できる具体的な情報</li>
              <li><strong>専門性:</strong> E-A-T（専門性・権威性・信頼性）を重視</li>
              <li><strong>透明性:</strong> すべての参照元を明示</li>
              <li><strong>最新性:</strong> 最新の法令や制度に対応</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">カバーするトピック</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '日本への移住とビザ取得',
                '転職市場とキャリア戦略',
                '金融商品と投資戦略',
                '税務制度と節税対策',
                '社会保険と年金制度',
                '日本のビジネス文化',
                '住宅・不動産市場',
                '医療制度と健康管理',
              ].map((topic, idx) => (
                <div key={idx} className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">免責事項</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              このサイトの情報は教育目的で提供されています。
              個別の法的、税務、財務に関する決定を行う前に、必ず適切な専門家に相談してください。
              当サイトは、提供された情報の使用から生じるいかなる損害についても責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ご質問、ご意見、またはコンテンツに関するご提案がございましたら、
              お気軽にお問い合わせください。
            </p>
            <a
              href="mailto:contact@shiftjapaninsight.com"
              className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
            >
              contact@shiftjapaninsight.com →
            </a>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
