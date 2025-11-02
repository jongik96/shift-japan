import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    return {}
  }

  const dictionary = await getDictionary(locale)
  const baseUrl = 'https://shiftjapaninsight.com'
  const url = `${baseUrl}/${locale}/about`

  return {
    title: `${dictionary.about.title} | Shift Japan Insight`,
    description: dictionary.about.whatIsDesc1,
    openGraph: {
      title: dictionary.about.title,
      description: dictionary.about.whatIsDesc1,
      url,
      siteName: 'Shift Japan Insight',
      images: [
        {
          url: `${baseUrl}/shiftjapan-og.png`,
          width: 1200,
          height: 630,
          alt: dictionary.about.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical: url,
      languages: {
        'ja': `${baseUrl}/ja/about`,
        'en': `${baseUrl}/en/about`,
        'ko': `${baseUrl}/ko/about`,
      },
    },
  }
}

export default async function AboutPage({ params }: PageProps) {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{dictionary.about.title}</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.whatIs}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{dictionary.about.whatIsDesc1}</p>
            <p className="text-gray-700 leading-relaxed">{dictionary.about.whatIsDesc2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.mission}</h2>
            <p className="text-gray-700 leading-relaxed">{dictionary.about.missionDesc}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.features}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>{dictionary.about.featuresList.dataDriven.split(':')[0]}:</strong>{' '}
                {dictionary.about.featuresList.dataDriven.split(':')[1]}
              </li>
              <li>
                <strong>{dictionary.about.featuresList.practical.split(':')[0]}:</strong>{' '}
                {dictionary.about.featuresList.practical.split(':')[1]}
              </li>
              <li>
                <strong>{dictionary.about.featuresList.expertise.split(':')[0]}:</strong>{' '}
                {dictionary.about.featuresList.expertise.split(':')[1]}
              </li>
              <li>
                <strong>{dictionary.about.featuresList.transparency.split(':')[0]}:</strong>{' '}
                {dictionary.about.featuresList.transparency.split(':')[1]}
              </li>
              <li>
                <strong>{dictionary.about.featuresList.freshness.split(':')[0]}:</strong>{' '}
                {dictionary.about.featuresList.freshness.split(':')[1]}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.topics}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(dictionary.about.topicsList as string[]).map((topic, idx) => (
                <div key={idx} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.disclaimer}</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{dictionary.about.disclaimerText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.about.contact}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{dictionary.about.contactDesc}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              {dictionary.about.contactLink}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }, { locale: 'ko' }]
}

