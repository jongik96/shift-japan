import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <section className="mb-8">
            <p className="text-sm text-gray-500 mb-6">
              最終更新日: {new Date().toLocaleDateString('ja-JP')}
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Shift Japan Insight（以下「当サイト」といいます）は、ユーザーの個人情報の保護を非常に重要視しています。
              本プライバシーポリシーは、当サイトがどのように個人情報を収集、使用、保護するかを説明します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 収集する情報</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトでは、以下の情報を収集する場合があります：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>氏名、メールアドレス（お問い合わせフォームから）</li>
              <li>IPアドレス、ブラウザ情報、訪問日時（アクセスログ）</li>
              <li>Cookie情報（サービスの改善のために使用）</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 情報の使用目的</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              収集した情報は、以下の目的で使用します：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>お問い合わせへの対応</li>
              <li>サービスの改善・分析</li>
              <li>ユーザー体験の向上</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 情報の共有</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、法律で義務付けられている場合を除き、
              ユーザーの個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookieについて</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトでは、サービスの向上のためにCookieを使用しています。
              Cookieは、ユーザーのブラウザに送信され、コンピューターに保存されます。
              ブラウザの設定により、Cookieの受け入れを拒否することができます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 個人情報の保護</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、個人情報の安全を確保するため、
              適切な技術的・組織的セキュリティ対策を実施しています。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              プライバシーポリシーに関するご質問は、
              お問い合わせフォームまたは以下のメールアドレスまでご連絡ください。
            </p>
            <p className="text-gray-700 mt-2">
              <strong>連絡先:</strong>{' '}
              <a href="mailto:contact@shiftjapaninsight.com" className="text-blue-600 hover:text-blue-700">
                contact@shiftjapaninsight.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 変更について</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、本プライバシーポリシーを随時変更することがあります。
              重要な変更がある場合は、サイト上でお知らせします。
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
