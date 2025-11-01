import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRenderer from '@/components/ContentRenderer'
import TOC from '@/components/TOC'
import ShareBar from '@/components/ShareBar'
import MobileTOCButton from '@/components/MobileTOCButton'
import { supabase } from '@/lib/supabase'
import { TOCItem } from '@/lib/types'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: report } = await supabase
    .from('insight_posts')
    .select('title, excerpt, main_image, tags')
    .eq('slug', params.slug)
    .single()

  if (!report) {
    return {
      title: 'レポートが見つかりません',
    }
  }

  return {
    title: `${report.title} | Shift Japan Insight`,
    description: report.excerpt,
    keywords: report.tags?.join(', '),
    openGraph: {
      title: report.title,
      description: report.excerpt,
      images: [report.main_image],
    },
  }
}

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const { data: report, error } = await supabase
    .from('insight_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !report) {
    notFound()
  }

  // Extract TOC items from content_blocks
  const tocItems: TOCItem[] = report.content_blocks
    .map((block: any, index: number) => {
      if (block.type === 'heading_h2') {
        return {
          id: `heading-${index}`,
          text: block.content.text,
          level: 2,
        }
      }
      return null
    })
    .filter(Boolean) as TOCItem[]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Container */}
        <div className="flex gap-8">
          {/* TOC Desktop */}
          <div className="hidden lg:block">
            <TOC items={tocItems} />
          </div>

          {/* Main Content */}
          <article className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {report.categories?.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {report.title}
              </h1>
              {report.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">{report.excerpt}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>公開日: {new Date(report.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              {report.main_image && (
                <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-gray-200">
                  <img src={report.main_image} alt={report.title} className="w-full h-full object-cover" />
                </div>
              )}
            </header>

            {/* Mobile TOC Button */}
            <MobileTOCButton items={tocItems} />

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <ContentRenderer blocks={report.content_blocks} />
            </div>

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">関連タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {report.sources && report.sources.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">参照元</h3>
                <ul className="space-y-2">
                  {report.sources.map((source: any, index: number) => (
                    <li key={index}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Share Bar Desktop */}
          <div className="hidden lg:block">
            <ShareBar title={report.title} isFixed={true} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
