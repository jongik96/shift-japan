import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <section className="mb-8">
            <p className="text-sm text-gray-500 mb-6">
              最終更新日: {new Date().toLocaleDateString('ja-JP')}
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              本利用規約（以下「本規約」といいます）は、Shift Japan Insight（以下「当サイト」といいます）
              の利用条件を定めるものです。当サイトをご利用いただく前に、必ずお読みください。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 適用</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約は、当サイトの利用者全員に適用されます。
              当サイトを利用することにより、利用者は本規約に同意したものとみなされます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 利用目的</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトは、日本への移住、転職、キャリアに関する情報提供を目的としています。
              以下の目的で利用することは禁止されています：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サイトのサーバーまたはネットワークに支障を与える行為</li>
              <li>当サイトのコンテンツを無断で転載、複製、販売する行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 知的財産権</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトに掲載されている全てのコンテンツ（テキスト、画像、図表など）の
              著作権は、当サイトまたは正当な権利者に帰属します。
              当サイトの事前の書面による許可なく、これらのコンテンツを複製、転載、販売することはできません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 免責事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトは、以下の事項について一切の責任を負いません：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>当サイトに掲載された情報の正確性、完全性、有用性</li>
              <li>当サイトの利用により生じた損害（直接、間接を問わない）</li>
              <li>当サイトの中断、終了、情報の消失</li>
              <li>第三者による不正なアクセス、データ改ざん</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 外部リンク</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、外部サイトへのリンクを含む場合がありますが、
              リンク先の内容やプライバシーポリシーについて当サイトは責任を負いません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 規約の変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、本規約を予告なく変更することがあります。
              重要な変更がある場合は、サイト上でお知らせします。
              変更後の規約は、当サイト上に掲載された時点で効力を生じます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 準拠法・管轄裁判所</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約の解釈および適用は、日本法に準拠するものとします。
              本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約に関するご質問は、以下までご連絡ください。
            </p>
            <p className="text-gray-700 mt-2">
              <strong>連絡先:</strong>{' '}
              <a href="mailto:contact@shiftjapaninsight.com" className="text-blue-600 hover:text-blue-700">
                contact@shiftjapaninsight.com
              </a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
