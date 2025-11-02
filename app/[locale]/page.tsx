import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getTableName } from '@/lib/i18n/config'
import { supabase } from '@/lib/supabase'
import HomeClient from './HomeClient'

interface PageProps {
  params: { locale: string }
}

const POSTS_PER_PAGE = 16

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    return {}
  }

  const dictionary = await getDictionary(locale)
  const baseUrl = 'https://shiftjapaninsight.com'
  const url = locale === 'ja' ? baseUrl : `${baseUrl}/${locale}`

  return {
    title: dictionary.home.title,
    description: dictionary.home.subtitle,
    openGraph: {
      title: dictionary.home.title,
      description: dictionary.home.subtitle,
      url,
      siteName: 'Shift Japan Insight',
      images: [
        {
          url: `${baseUrl}/shiftjapan-og.png`,
          width: 1200,
          height: 630,
          alt: dictionary.home.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.home.title,
      description: dictionary.home.subtitle,
      images: [`${baseUrl}/shiftjapan-og.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        'ja': baseUrl,
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)
  const tableName = getTableName(locale)

  // Fetch reports
  const { data: reports = [], error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reports:', error)
  }

  return <HomeClient locale={locale} dictionary={dictionary} initialReports={reports || []} />
}

export async function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }, { locale: 'ko' }]
}

