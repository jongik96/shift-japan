'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations, useLocale } from '@/lib/i18n/hooks'

export default function NotFound() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t('notFound.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {t('notFound.home')}
          </Link>
          <Link
            href={`/${locale}/reports`}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            {t('notFound.reports')}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

