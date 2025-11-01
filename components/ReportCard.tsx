import Link from 'next/link'

interface ReportCardProps {
  id: string
  slug: string
  title: string
  excerpt: string
  main_image?: string
  categories: string[]
  created_at: string
}

export default function ReportCard({
  slug,
  title,
  excerpt,
  main_image,
  categories,
  created_at,
}: ReportCardProps) {
  return (
    <Link
      href={`/report/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition group"
    >
      {main_image ? (
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          <img
            src={main_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200"></div>
      )}
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {categories?.slice(0, 1).map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2 min-h-[3rem]">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
          <span className="text-blue-600 font-semibold group-hover:text-blue-700">
            詳細 →
          </span>
        </div>
      </div>
    </Link>
  )
}
