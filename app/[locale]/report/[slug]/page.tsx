import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale, type Locale, getTableName } from '@/lib/i18n/config'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReportClient from '@/components/ReportClient'

interface PageProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params?.locale || 'ja'
  const slug = params?.slug || ''

  if (!isValidLocale(locale)) {
    return {}
  }

  const tableName = getTableName(locale)

  try {
    const { data: report } = await supabase
      .from(tableName)
      .select('*')
      .eq('slug', slug)
      .single()

    if (!report) {
      return {}
    }

    const baseUrl = 'https://shiftjapaninsight.com'
    const url = `${baseUrl}/${locale}/report/${slug}`
    const imageUrl = report.main_image || `${baseUrl}/shiftjapan-og.png`

    return {
      title: report.title,
      description: report.excerpt || report.title,
      openGraph: {
        title: report.title,
        description: report.excerpt || report.title,
        url,
        siteName: 'Shift Japan Insight',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: report.title,
          },
        ],
        locale: locale,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: report.title,
        description: report.excerpt || report.title,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
        languages: {
          'ja': `${baseUrl}/ja/report/${slug}`,
          'en': `${baseUrl}/en/report/${slug}`,
          'ko': `${baseUrl}/ko/report/${slug}`,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {}
  }
}

export default async function ReportPage({ params }: PageProps) {
  const locale = params?.locale || 'ja'
  const slug = params?.slug || ''

  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)
  const tableName = getTableName(locale)

  try {
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
        <ReportClient report={report} locale={locale} dictionary={dictionary} />
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error fetching report:', error)
    notFound()
  }
}

export async function generateStaticParams() {
  const locales: Locale[] = ['ja', 'en', 'ko']
  const paths: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    try {
      const tableName = getTableName(locale)
      const { data } = await supabase.from(tableName).select('slug')

      if (data) {
        data.forEach((report) => {
          paths.push({
            locale,
            slug: report.slug,
          })
        })
      }
    } catch (error) {
      console.error(`Error fetching slugs for ${locale}:`, error)
    }
  }

  return paths
}

