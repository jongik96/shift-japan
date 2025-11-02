import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
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
  const url = `${baseUrl}/${locale}/contact`

  return {
    title: `${dictionary.contact.title} | Shift Japan Insight`,
    description: dictionary.contact.description,
    openGraph: {
      title: dictionary.contact.title,
      description: dictionary.contact.description,
      url,
      siteName: 'Shift Japan Insight',
      images: [
        {
          url: `${baseUrl}/shiftjapan-og.png`,
          width: 1200,
          height: 630,
          alt: dictionary.contact.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical: url,
      languages: {
        'ja': `${baseUrl}/ja/contact`,
        'en': `${baseUrl}/en/contact`,
        'ko': `${baseUrl}/ko/contact`,
      },
    },
  }
}

export default async function ContactPage({ params }: PageProps) {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sm:p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {dictionary.contact.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-900 mb-6">
              {dictionary.contact.description}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
              <p className="text-sm sm:text-base text-gray-900">
                {dictionary.contact.responseTime}
              </p>
            </div>
          </div>

          <div className="text-center py-8">
            <a
              href="mailto:pji3503@gmail.com"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {dictionary.contact.sendEmail}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }, { locale: 'ko' }]
}

