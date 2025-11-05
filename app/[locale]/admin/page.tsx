'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  slug: string
  title: string
  created_at: string
  updated_at: string
  locale?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocale, setSelectedLocale] = useState<'ja' | 'en' | 'ko'>('ko')
  const [allPosts, setAllPosts] = useState<{ [key: string]: Post[] }>({ ja: [], en: [], ko: [] })

  useEffect(() => {
    // 관리자 페이지는 항상 /ko로 접근
    const pathname = window.location.pathname
    const currentLocale = pathname.split('/')[1]
    
    // /ko가 아니면 /ko/admin으로 리다이렉트
    if (currentLocale !== 'ko') {
      router.push('/ko/admin')
      return
    }

    // 인증 확인
    const auth = localStorage.getItem('admin_authenticated')
    if (auth !== 'true') {
      router.push('/ko/admin/login')
      return
    }

    // 로컬 환경 확인
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (!isLocal) {
      router.push('/')
      return
    }

    // 모든 언어의 글 목록 가져오기
    fetchAllPosts()
  }, [router])

  const fetchAllPosts = async () => {
    try {
      const locales: ('ja' | 'en' | 'ko')[] = ['ja', 'en', 'ko']
      const postsData: { [key: string]: Post[] } = { ja: [], en: [], ko: [] }

      for (const loc of locales) {
        const tableName = `blog_${loc}`
        const { data, error } = await supabase
          .from(tableName)
          .select('id, slug, title, created_at, updated_at')
          .order('created_at', { ascending: false })

        if (error) {
          console.error(`Error fetching ${loc} posts:`, error)
        } else {
          postsData[loc] = (data || []).map(post => ({ ...post, locale: loc })) as any
        }
      }

      setAllPosts(postsData)
      setPosts(postsData[selectedLocale])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 선택된 언어가 변경되면 해당 언어의 글 목록 표시
    if (allPosts[selectedLocale]) {
      setPosts(allPosts[selectedLocale])
    }
  }, [selectedLocale, allPosts])

  const handleDelete = async (id: string, locale: 'ja' | 'en' | 'ko') => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const tableName = `blog_${locale}`
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchAllPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 글 목록</h1>
          <p className="text-gray-600">
            {selectedLocale === 'ja' ? '일본어' : selectedLocale === 'en' ? '영어' : '한국어'}: 총 {posts.length}개의 글
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedLocale('ja')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'ja'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇯🇵 일본어 ({allPosts.ja.length})
          </button>
          <button
            onClick={() => setSelectedLocale('en')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇺🇸 영어 ({allPosts.en.length})
          </button>
          <button
            onClick={() => setSelectedLocale('ko')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'ko'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇰🇷 한국어 ({allPosts.ko.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] max-w-[400px]">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] max-w-[250px]">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  수정일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    작성된 글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-[400px] truncate" title={post.title}>
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-[250px] truncate" title={post.slug}>
                        {post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(post.updated_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 flex-shrink-0">
                        <Link
                          href={`/${selectedLocale}/report/${post.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                        >
                          보기
                        </Link>
                        <Link
                          href={`/ko/admin/edit/${post.id}?locale=${selectedLocale}`}
                          className="text-green-600 hover:text-green-900 whitespace-nowrap"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, selectedLocale)}
                          className="text-red-600 hover:text-red-900 whitespace-nowrap"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

