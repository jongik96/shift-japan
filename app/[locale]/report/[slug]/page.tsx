import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReportClient from './ReportClient'
import { supabase } from '@/lib/supabase'

import { locales, type Locale } from '@/i18n'
import { getTableName } from '@/lib/i18n/routing'

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

interface ReportPageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata(
  { params }: ReportPageProps
): Promise<Metadata> {
  const { locale, slug } = params
  
  if (!isValidLocale(locale)) {
    return {}
  }

  try {
    const tableName = getTableName(locale as Locale)
    const { data: report } = await supabase
      .from(tableName)
      .select('title, excerpt, main_image, categories, tags, created_at')
      .eq('slug', slug)
      .single()

    if (!report) {
      return {}
    }

    const localeMap: Record<Locale, string> = {
      ja: 'ja_JP',
      en: 'en_US',
      ko: 'ko_KR',
    }

    const keywords = [
      ...(report.categories || []),
      ...(report.tags || []),
      'Shift Japan Insight',
      locale === 'ja' ? '日本転職' : locale === 'ko' ? '日本転職' : 'Japan Career',
      locale === 'ja' ? '移住' : locale === 'ko' ? '이주' : 'Migration',
    ]

    return {
      title: report.title,
      description: report.excerpt || `${report.title} - Shift Japan Insight`,
      keywords: keywords.join(', '),
      authors: [{ name: 'Shift Japan Insight' }],
      openGraph: {
        title: report.title,
        description: report.excerpt || '',
        type: 'article',
        locale: localeMap[locale as Locale],
        url: `https://shiftjapaninsight.com/${locale}/report/${slug}`,
        siteName: 'Shift Japan Insight',
        images: report.main_image ? [
          {
            url: report.main_image,
            width: 1200,
            height: 630,
            alt: report.title,
          },
        ] : [
          {
            url: 'https://shiftjapaninsight.com/shiftjapan-og.png',
            width: 1200,
            height: 630,
            alt: 'Shift Japan Insight',
          },
        ],
        publishedTime: report.created_at,
      },
      twitter: {
        card: 'summary_large_image',
        title: report.title,
        description: report.excerpt || '',
        images: report.main_image ? [report.main_image] : ['https://shiftjapaninsight.com/shiftjapan-og.png'],
      },
      alternates: {
        canonical: `https://shiftjapaninsight.com/${locale}/report/${slug}`,
        languages: {
          'ja': `https://shiftjapaninsight.com/ja/report/${slug}`,
          'en': `https://shiftjapaninsight.com/en/report/${slug}`,
          'ko': `https://shiftjapaninsight.com/ko/report/${slug}`,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {}
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { locale, slug } = params

  if (!isValidLocale(locale)) {
    notFound()
  }

  try {
    const tableName = getTableName(locale as Locale)
    const { data: report, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !report) {
      notFound()
    }

    return (
      <>
        <Header />
        <ReportClient report={report} locale={locale as Locale} />
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error fetching report:', error)
    notFound()
  }
}

