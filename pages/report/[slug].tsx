import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReportClient from '@/components/ReportClient'
import { supabase } from '@/lib/supabase'
import { type Locale, getTableName } from '@/lib/i18n/routing'

interface ReportPageProps {
  report: any
}

function isValidLocale(locale: string): locale is Locale {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

export default function ReportPage({ report }: ReportPageProps) {
  const router = useRouter()
  const locale = (router.locale || 'ja') as Locale

  if (!report) {
    return null
  }

  return (
    <>
      <Header />
      <ReportClient report={report} locale={locale} />
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all slugs from all locale tables
  const locales: Locale[] = ['ja', 'en', 'ko']
  const paths: { params: { slug: string }; locale: string }[] = []

  for (const locale of locales) {
    try {
      const tableName = getTableName(locale)
      const { data } = await supabase
        .from(tableName)
        .select('slug')

      if (data) {
        data.forEach((report) => {
          paths.push({
            params: { slug: report.slug },
            locale,
          })
        })
      }
    } catch (error) {
      console.error(`Error fetching slugs for ${locale}:`, error)
    }
  }

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  const validLocale: Locale = isValidLocale(locale || 'ja') ? (locale as Locale) : 'ja'

  try {
    const tableName = getTableName(validLocale)
    const { data: report, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !report) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        report,
        ...(await serverSideTranslations(validLocale, ['common'])),
      },
      revalidate: 60, // ISR: Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching report:', error)
    return {
      notFound: true,
    }
  }
}

