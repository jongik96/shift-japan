'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ContentBlock } from '@/lib/types'

export default function NewPostPage() {
  const router = useRouter()
  const [selectedLocale, setSelectedLocale] = useState<'ja' | 'en' | 'ko'>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form fields
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([])
  const [markdownContent, setMarkdownContent] = useState('')
  const [easyMDE, setEasyMDE] = useState<any>(null)

  useEffect(() => {
    // 관리자 페이지는 항상 /ko로 접근
    const pathname = window.location.pathname
    const currentLocale = pathname.split('/')[1]
    
    // /ko가 아니면 /ko/admin/new로 리다이렉트
    if (currentLocale !== 'ko') {
      router.push('/ko/admin/new')
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

    setLoading(false)

    // 기존 카테고리 가져오기 (초기 언어로)
    fetchAvailableCategories(selectedLocale)
  }, [router])

  // 기존 카테고리 가져오기 (선택된 언어에 따라)
  const fetchAvailableCategories = async (locale: 'ja' | 'en' | 'ko') => {
    try {
      setLoadingCategories(true)
      const allCategories = new Set<string>()
      
      // 선택된 언어의 테이블에서만 카테고리 가져오기
      const tableName = `blog_${locale}`
      const { data, error } = await supabase
        .from(tableName)
        .select('categories')
      
      if (error) {
        console.error(`Error fetching categories from ${locale}:`, error)
      } else {
        // 각 글의 categories 배열을 Set에 추가
        data?.forEach((post: any) => {
          if (post.categories && Array.isArray(post.categories)) {
            post.categories.forEach((cat: string) => {
              if (cat && cat.trim()) {
                allCategories.add(cat.trim())
              }
            })
          }
        })
      }
      
      // 알파벳 순으로 정렬
      const sortedCategories = Array.from(allCategories).sort()
      setAvailableCategories(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // 언어 변경 시 카테고리 다시 가져오기
  useEffect(() => {
    if (!loading) {
      fetchAvailableCategories(selectedLocale)
    }
  }, [selectedLocale, loading])

  // EasyMDE 초기화 (별도 useEffect)
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && !easyMDE) {
      const initEditor = async () => {
        const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
        
        if (!textarea) {
          // textarea가 아직 준비되지 않았으면 잠시 후 다시 시도
          setTimeout(initEditor, 100)
          return
        }
        
        const EasyMDEModule = await import('easymde')
        const EasyMDE = EasyMDEModule.default
        
        const editor = new EasyMDE({
          element: textarea,
          spellChecker: false,
          placeholder: '마크다운으로 글을 작성하세요...',
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', 'table', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
          ],
          initialValue: markdownContent || '',
        })
        
        setEasyMDE(editor)
        
        // codemirror가 준비될 때까지 대기 후 이벤트 리스너 등록
        const setupChangeListener = () => {
          if (editor.codemirror) {
            editor.codemirror.on('change', () => {
              setMarkdownContent(editor.value())
            })
          } else {
            // codemirror가 아직 준비되지 않았으면 잠시 후 다시 시도
            setTimeout(setupChangeListener, 50)
          }
        }
        setupChangeListener()
      }
      
      // DOM이 준비될 때까지 대기
      setTimeout(initEditor, 100)
    }
    
    // cleanup 함수
    return () => {
      if (easyMDE) {
        try {
          easyMDE.toTextArea()
          easyMDE.cleanup?.()
        } catch (e) {
          // cleanup 중 오류는 무시
        }
      }
    }
  }, [loading, easyMDE]) // loading이 false가 되고 easyMDE가 없을 때만 초기화

  const markdownToContentBlocks = (markdown: string): ContentBlock[] => {
    const blocks: ContentBlock[] = []
    const lines = markdown.split('\n')
    
    let currentParagraph = ''
    
    // URL 패턴 (http:// 또는 https://로 시작하고 공백이 없는 완전한 URL)
    const urlPattern = /^https?:\/\/[^\s]+$/i
    // 마크다운 링크 패턴
    const markdownLinkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/i
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // H2 헤딩
      if (trimmedLine.startsWith('## ')) {
        if (currentParagraph.trim()) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trim() }
          })
          currentParagraph = ''
        }
        blocks.push({
          type: 'heading_h2',
          content: { text: trimmedLine.substring(3) }
        })
      }
      // 빈 줄 - 단락 구분
      else if (trimmedLine === '') {
        if (currentParagraph.trim()) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trim() }
          })
          currentParagraph = ''
        }
      }
      // URL만 있는 줄 (standalone URL) - 별도 paragraph로 저장
      else if (urlPattern.test(trimmedLine)) {
        // 이전 paragraph가 있으면 먼저 저장
        if (currentParagraph.trim()) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trim() }
          })
          currentParagraph = ''
        }
        // URL만 있는 paragraph로 저장 (ContentRenderer에서 감지 가능하도록)
        blocks.push({
          type: 'paragraph',
          content: { text: trimmedLine }
        })
      }
      // 마크다운 링크 형식만 있는 줄
      else if (markdownLinkPattern.test(trimmedLine)) {
        // 이전 paragraph가 있으면 먼저 저장
        if (currentParagraph.trim()) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trim() }
          })
          currentParagraph = ''
        }
        // 마크다운 링크를 그대로 저장 (ContentRenderer에서 감지 가능하도록)
        blocks.push({
          type: 'paragraph',
          content: { text: trimmedLine }
        })
      }
      // 일반 텍스트
      else {
        currentParagraph += (currentParagraph ? '\n' : '') + line
      }
    }
    
    // 마지막 단락 추가
    if (currentParagraph.trim()) {
      blocks.push({
        type: 'paragraph',
        content: { text: currentParagraph.trim() }
      })
    }
    
    return blocks
  }

  const handleToggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat))
    } else {
      setCategories([...categories, cat])
    }
  }

  const handleAddNewCategory = () => {
    const newCategory = prompt('새 카테고리 이름을 입력하세요:')
    if (newCategory && newCategory.trim() && !categories.includes(newCategory.trim()) && !availableCategories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setAvailableCategories([...availableCategories, newCategory.trim()].sort())
    } else if (newCategory && newCategory.trim() && availableCategories.includes(newCategory.trim())) {
      // 이미 존재하는 카테고리면 선택만 추가
      if (!categories.includes(newCategory.trim())) {
        setCategories([...categories, newCategory.trim()])
      }
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleAddSource = () => {
    setSources([...sources, { title: '', url: '' }])
  }

  const handleUpdateSource = (index: number, field: 'title' | 'url', value: string) => {
    const newSources = [...sources]
    newSources[index] = { ...newSources[index], [field]: value }
    setSources(newSources)
  }

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!slug || !title || !excerpt) {
      alert('Slug, 제목, 요약은 필수입니다.')
      return
    }

    setSaving(true)

    try {
      // EasyMDE 에디터에서 최신 마크다운 내용 가져오기
      let finalMarkdownContent = markdownContent
      if (easyMDE) {
        finalMarkdownContent = easyMDE.value()
        setMarkdownContent(finalMarkdownContent) // state도 업데이트
      }

      // 마크다운을 ContentBlocks로 변환
      const blocks = markdownToContentBlocks(finalMarkdownContent)
      
      const tableName = `blog_${selectedLocale}`
      
      // 저장할 데이터 로깅 (디버깅용)
      const insertData = {
        slug,
        title,
        excerpt,
        main_image: mainImage || null,
        content_blocks: blocks,
        categories,
        tags,
        sources: sources.filter(s => s.title && s.url),
      }
      
      console.log('저장할 데이터:', {
        tableName,
        insertData: {
          ...insertData,
          content_blocks: `[${blocks.length} blocks]` // 블록 개수만 표시
        }
      })
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()

      if (error) {
        console.error('Supabase 저장 오류:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('저장된 데이터가 없습니다.')
      }

      console.log('저장 성공:', data)
      alert('글이 저장되었습니다!')
      router.push('/ko/admin')
    } catch (error: any) {
      console.error('Error saving post:', error)
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`)
    } finally {
      setSaving(false)
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">✏️ 새 글 작성</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedLocale('ja')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'ja'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇯🇵 일본어
          </button>
          <button
            type="button"
            onClick={() => setSelectedLocale('en')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇺🇸 영어
          </button>
          <button
            type="button"
            onClick={() => setSelectedLocale('ko')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedLocale === 'ko'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇰🇷 한국어
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          현재 선택: {selectedLocale === 'ja' ? '일본어' : selectedLocale === 'en' ? '영어' : '한국어'} (blog_{selectedLocale})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="url-friendly-slug"
              required
            />
            <p className="mt-1 text-xs text-gray-500">URL에 사용될 고유한 식별자 (예: japan-relocation-guide)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              요약 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지 URL
            </label>
            <input
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">카테고리</h2>
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              + 새 카테고리
            </button>
          </div>
          
          {loadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">기존 카테고리에서 선택 (클릭하여 선택/해제)</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      categories.includes(cat)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat} {categories.includes(cat) && '✓'}
                  </button>
                ))}
              </div>
              
              {categories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">선택된 카테고리:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(cat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 태그 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">태그</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="태그 입력 후 Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">본문 (마크다운)</h2>
          <div id="markdown-editor-container">
            <textarea
              id="markdown-editor"
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              className="w-full min-h-[400px] font-mono"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 H2 헤딩(##)은 자동으로 섹션 제목으로 변환됩니다.
          </p>
        </div>

        {/* 출처 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">출처</h2>
            <button
              type="button"
              onClick={handleAddSource}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              + 출처 추가
            </button>
          </div>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={source.title}
                  onChange={(e) => handleUpdateSource(index, 'title', e.target.value)}
                  placeholder="출처 제목"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  value={source.url}
                  onChange={(e) => handleUpdateSource(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSource(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/ko/admin')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

