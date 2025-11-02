'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function AdminPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      // Fetch from all locale tables
      const allReports: any[] = []
      
      for (const loc of ['ja', 'en', 'ko'] as const) {
        const { data, error } = await supabase
          .from(`blog_${loc}`)
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          // Add locale to each report
          allReports.push(...data.map((r: any) => ({ ...r, _locale: loc })))
        }
      }

      // Sort by created_at
      allReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      setReports(allReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, locale: string) => {
    try {
      const tableName = `blog_${locale}`
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (!error) {
        setReports(reports.filter(r => r.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('삭제에 실패했습니다')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getLocaleLabel = (locale: string) => {
    const labels: Record<string, string> = {
      ja: '🇯🇵 일본어',
      en: '🇺🇸 영어',
      ko: '🇰🇷 한국어'
    }
    return labels[locale] || locale.toUpperCase()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 글 목록</h1>
          <p className="text-gray-600">총 {reports.length}개의 글이 있습니다</p>
        </div>
        <Link
          href={`/${locale}/admin/new`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg font-medium"
        >
          <span className="text-xl">✏️</span>
          새 글 작성
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg mb-4">아직 작성된 글이 없습니다</p>
          <Link 
            href={`/${locale}/admin/new`} 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>첫 번째 글을 작성하세요 →</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    언어
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-md">
                        {report.title}
                      </div>
                      {report.excerpt && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {report.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                        {getLocaleLabel(report._locale || 'ja')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {report.categories?.slice(0, 2).map((cat: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {cat}
                          </span>
                        ))}
                        {report.categories && report.categories.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{report.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/${report._locale || 'ja'}/report/${report.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          <span>👁️</span>
                          <span className="hidden sm:inline">보기</span>
                        </Link>
                        <Link
                          href={`/${locale}/admin/edit/${report.id}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition"
                        >
                          <span>✏️</span>
                          <span className="hidden sm:inline">수정</span>
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(`${report.id}:${report._locale || 'ja'}`)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                        >
                          <span>🗑️</span>
                          <span className="hidden sm:inline">삭제</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">삭제 확인</h3>
              <p className="text-gray-600">
                이 글을 삭제하시겠습니까?<br />
                <span className="font-semibold text-red-600">이 작업은 되돌릴 수 없습니다.</span>
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const [id, loc] = deleteConfirm.split(':')
                  handleDelete(id, loc || 'ja')
                }}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-md"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

