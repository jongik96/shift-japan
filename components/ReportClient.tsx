'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import ContentRenderer from '@/components/ContentRenderer'
import TOC from '@/components/TOC'
import ShareBar from '@/components/ShareBar'
import MobileTOCButton from '@/components/MobileTOCButton'
import { TOCItem } from '@/lib/types'
import { Locale } from '@/lib/i18n/routing'

interface ReportClientProps {
  report: any
  locale: Locale
}

export default function ReportClient({ report, locale }: ReportClientProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [tocItems, setTocItems] = useState<TOCItem[]>([])

  useEffect(() => {
    // Extract TOC items from content_blocks
    const items: TOCItem[] = report.content_blocks
      ?.map((block: any, index: number) => {
        if (block.type === 'heading_h2') {
          return {
            id: `heading-${index}`,
            text: block.content.text,
            level: 2,
          }
        }
        return null
      })
      .filter(Boolean) as TOCItem[] || []
    setTocItems(items)
  }, [report.content_blocks])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      {/* Back to List Button - Top */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('report.backToList')}
        </Link>
      </div>

      {/* Article Container */}
      <div className="flex gap-4 sm:gap-6 lg:gap-8">
        {/* TOC Desktop */}
        <div className="hidden lg:block">
          <TOC items={tocItems} />
        </div>

        {/* Main Content */}
        <article className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {report.categories?.map((cat: string) => (
                <span
                  key={cat}
                  className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {report.title}
            </h1>
            {report.excerpt && (
              <p className="text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 leading-relaxed">{report.excerpt}</p>
            )}
            <div className="flex items-center text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
              <span>{t('report.published')} {new Date(report.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'ko' ? 'ko-KR' : 'en-US')}</span>
            </div>
            {report.main_image && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6 sm:mb-8 bg-gray-200">
                <img src={report.main_image} alt={report.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          {/* Mobile TOC Button */}
          <MobileTOCButton items={tocItems} />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ContentRenderer blocks={report.content_blocks || []} />
          </div>

          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">{t('report.relatedTags')}</h3>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {report.sources && report.sources.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">{t('report.sources')}</h3>
              <ul className="space-y-2">
                {report.sources.map((source: any, index: number) => (
                  <li key={index} className="text-sm sm:text-base">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back to List Button - Bottom */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('report.backToList')}
            </Link>
          </div>
        </article>

        {/* Share Bar Desktop */}
        <div className="hidden lg:block">
          <ShareBar title={report.title} isFixed={true} />
        </div>
      </div>
    </main>
  )
}

