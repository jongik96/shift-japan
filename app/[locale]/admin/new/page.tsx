'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// EasyMDE will be loaded dynamically in useEffect

import { type Locale, locales } from '@/lib/i18n/config'
import { getTableName } from '@/lib/i18n/routing'

const categoriesByLocale: Record<Locale, string[]> = {
  ja: ['お知らせ', '移住・生活', 'キャリア・ビジネス', '金融・投資', '税務・法令', '文化・社会', 'データ分析', '旅行', 'グルメ・飲食'],
  en: ['Announcement', 'Migration & Living', 'Career & Business', 'Finance & Investment', 'Tax & Legal', 'Culture & Society', 'Data Analysis', 'Travel', 'Food & Dining'],
  ko: ['공지', '이주·생활', '커리어·비즈니스', '금융·투자', '세무·법령', '문화·사회', '데이터 분석', '여행', '맛집'],
}

export default function NewPostPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const editorInstance = useRef<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    main_image: '',
    content: '',
    categories: [] as string[],
    tags: [] as string[],
    sources: [] as Array<{ title: string; url: string }>,
    locale: 'ja' as Locale,
    created_at: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = categoriesByLocale[formData.locale]

  useEffect(() => {
    let mounted = true
    let cssLink: HTMLLinkElement | null = null

    const loadEditor = async () => {
        // Load CSS only once
        if (!document.querySelector('link[href*="easymde"]')) {
          cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://cdn.jsdelivr.net/npm/easymde@2.18.0/dist/easymde.min.css'
          document.head.appendChild(cssLink)
        }

        // Load marked.js for preview rendering
        if (!(window as any).marked) {
          const markedScript = document.createElement('script')
          markedScript.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js'
          await new Promise<void>((resolve, reject) => {
            markedScript.onload = () => resolve()
            markedScript.onerror = () => reject(new Error('Failed to load marked'))
            document.head.appendChild(markedScript)
          })
        }

        // Load EasyMDE
        const EasyMDE = (await import('easymde')).default

        if (mounted && editorRef.current && !editorInstance.current) {
          // Create EasyMDE instance first (without custom previewRender)
          editorInstance.current = new EasyMDE({
            element: editorRef.current,
            placeholder: 'Markdown 형식으로 글을 작성하세요...\n\n💡 URL preview 카드를 만들려면 URL을 단독으로 한 줄에 입력하세요:\nhttps://example.com',
            spellChecker: false,
            status: false,
            toolbar: [
              'bold', 'italic', 'heading', '|',
              'quote', 'unordered-list', 'ordered-list', '|',
              'link', 'image', 'table', '|',
              'code', 'horizontal-rule', '|',
              'preview', 'side-by-side', 'fullscreen', '|',
              'guide'
            ],
          })

          // Get marked instance (EasyMDE uses marked internally)
          const getMarkedInstance = () => {
            // First try window.marked (loaded via CDN)
            const windowMarked = (window as any).marked
            if (windowMarked) {
              // marked v9 UMD format: window.marked.marked.parse()
              if (windowMarked.marked && typeof windowMarked.marked.parse === 'function') {
                return windowMarked.marked
              }
              // Direct marked instance
              if (typeof windowMarked.parse === 'function') {
                return windowMarked
              }
            }
            // Try EasyMDE's internal marked
            const easymdeMarked = (editorInstance.current as any).marked || (EasyMDE as any).marked
            if (easymdeMarked) {
              const instance = easymdeMarked.marked || easymdeMarked
              if (typeof instance?.parse === 'function') {
                return instance
              }
            }
            return null
          }

          const markedInstance = getMarkedInstance()

          // Configure marked options if available
          if (markedInstance && markedInstance.setOptions) {
            markedInstance.setOptions({
              breaks: true,
              gfm: true,
            })
          }

          // Default preview renderer using marked
          const defaultPreviewRender = (text: string): string => {
            if (markedInstance) {
              try {
                // Use marked.parse() method
                if (typeof markedInstance.parse === 'function') {
                  return markedInstance.parse(text)
                }
                // Fallback for older marked versions
                return markedInstance(text)
              } catch (e) {
                console.warn('Marked parse error:', e)
                return text
              }
            }
            console.warn('Marked instance not available, returning plain text')
            return text
          }

          // Override previewRender to add URL preview cards
          editorInstance.current.options.previewRender = (plainText: string) => {
            try {
              // First, get the default HTML from EasyMDE
              let html = defaultPreviewRender(plainText)
              
              // Process standalone URLs and convert them to preview cards
              const lines = plainText.split('\n')
              lines.forEach((line) => {
                const trimmedLine = line.trim()
                const urlPattern = /^https?:\/\/[^\s]+$/i
                if (urlPattern.test(trimmedLine)) {
                  const url = trimmedLine
                  let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
                  
                  // Escape special regex characters in URL
                  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                  // Match various patterns that marked might create
                  const patterns = [
                    new RegExp(`<p><a[^>]*href=["']${escapedUrl}["'][^>]*>${escapedUrl}<\\/a><\\/p>`, 'g'),
                    new RegExp(`<p>${escapedUrl}<\\/p>`, 'g'),
                    new RegExp(`<a[^>]*href=["']${escapedUrl}["'][^>]*>${escapedUrl}<\\/a>`, 'g'),
                  ]
                  
                  patterns.forEach(pattern => {
                    html = html.replace(pattern, `
                      <div class="link-preview-card-editor" data-url="${url.replace(/"/g, '&quot;')}" style="margin: 1rem 0; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                        <a href="${url}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none; color: inherit;">
                          <div style="display: flex; align-items: start; flex-direction: row;">
                            <div class="link-preview-image" style="width: 200px; min-width: 200px; height: 120px; background: #f3f4f6; flex-shrink: 0; display: none;">
                              <img src="" alt="" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                            </div>
                            <div style="flex: 1; min-width: 0; padding: 1rem;">
                              <div style="display: flex; align-items: start; justify-content: space-between; gap: 0.5rem;">
                                <div style="flex: 1; min-width: 0;">
                                  <h4 class="link-preview-title" style="font-weight: 600; color: #111827; margin: 0 0 0.25rem 0; font-size: 1rem; line-height: 1.5;">${url}</h4>
                                  <p class="link-preview-description" style="font-size: 0.875rem; color: #6b7280; margin: 0.5rem 0; display: none;"></p>
                                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                                    <svg style="width: 1rem; height: 1rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                                    </svg>
                                    <span style="font-size: 0.75rem; color: #6b7280;">${domain}</span>
                                  </div>
                                </div>
                                <svg style="width: 1.25rem; height: 1.25rem; color: #9ca3af; flex-shrink: 0; margin-top: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    `)
                  })
                }
              })
              
              return html
            } catch (e) {
              console.error('Preview render error:', e)
              // Fallback to default preview or plain text
              try {
                return defaultPreviewRender ? defaultPreviewRender(plainText) : plainText
              } catch (fallbackError) {
                console.error('Fallback render error:', fallbackError)
                return plainText
              }
            }
          }

          // Handle editor content changes
          editorInstance.current.codemirror.on('change', () => {
            const value = editorInstance.current.value()
            setFormData(prev => ({ ...prev, content: value }))
          })

          // Function to fetch OG metadata for URL preview cards
          const fetchOGMetadata = async (url: string, cardElement: HTMLElement) => {
            try {
              // Use a CORS proxy or direct fetch if CORS allows
              const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
              const response = await fetch(proxyUrl)
              const data = await response.json()
              const htmlContent = data.contents

              if (!htmlContent) return

              // Parse HTML to extract OG metadata
              const parser = new DOMParser()
              const doc = parser.parseFromString(htmlContent, 'text/html')

              const getMetaContent = (property: string) => {
                const meta = doc.querySelector(`meta[property="${property}"], meta[name="${property}"]`)
                return meta ? meta.getAttribute('content') : null
              }

              const ogTitle = getMetaContent('og:title') || doc.querySelector('title')?.textContent || url
              const ogDescription = getMetaContent('og:description') || getMetaContent('description') || ''
              const ogImage = getMetaContent('og:image')
              const ogSiteName = getMetaContent('og:site_name') || ''

            // Update the preview card
            const titleEl = cardElement.querySelector('.link-preview-title') as HTMLElement | null
            const descEl = cardElement.querySelector('.link-preview-description') as HTMLElement | null
            const imageContainer = cardElement.querySelector('.link-preview-image') as HTMLElement | null
            const imgEl = imageContainer?.querySelector('img') as HTMLImageElement | null

            if (titleEl) {
              titleEl.textContent = ogTitle
            }

            if (descEl && ogDescription) {
              descEl.textContent = ogDescription
              descEl.style.display = 'block'
            }

            if (ogImage && imageContainer && imgEl) {
              imgEl.src = ogImage
              imgEl.alt = ogTitle
              imgEl.style.display = 'block'
              imageContainer.style.display = 'block'
              imgEl.onerror = () => {
                imageContainer.style.display = 'none'
              }
            }
            } catch (error) {
              console.warn('Failed to fetch OG metadata for', url, error)
            }
          }

          // Observe preview updates to fetch OG metadata
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  const element = node as HTMLElement
                  const previewCards = element.querySelectorAll?.('.link-preview-card-editor') || []
                  previewCards.forEach((card) => {
                    const url = (card as HTMLElement).dataset.url
                    if (url) {
                      fetchOGMetadata(url, card as HTMLElement)
                    }
                  })
                }
              })
            })
          })

          // Start observing the preview container when it's available
          setTimeout(() => {
            const previewContainer = document.querySelector('.EasyMDEContainer .editor-preview') || 
                                    document.querySelector('.editor-preview-side') ||
                                    document.querySelector('.editor-preview')
            if (previewContainer) {
              observer.observe(previewContainer, {
                childList: true,
                subtree: true
              })
              
              // Also check for existing preview cards
              const existingCards = previewContainer.querySelectorAll('.link-preview-card-editor')
              existingCards.forEach((card) => {
                const url = (card as HTMLElement).dataset.url
                if (url) {
                  fetchOGMetadata(url, card as HTMLElement)
                }
              })
            }
          }, 500)
        }
      }

    loadEditor()

    return () => {
      mounted = false
      if (editorInstance.current) {
        try {
          // Check if the editor element still exists in DOM
          if (editorRef.current && editorRef.current.parentNode) {
            editorInstance.current.toTextArea()
          }
        } catch (error) {
          // Ignore cleanup errors
          console.warn('Editor cleanup error:', error)
        } finally {
          editorInstance.current = null
        }
      }
      // CSS는 제거하지 않음 (다른 에디터에서도 사용할 수 있음)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate slug from title if not provided
      const finalSlug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Convert markdown content to content_blocks
      const contentBlocks = convertMarkdownToBlocks(formData.content)

      const tableName = getTableName(formData.locale)
      
      // Prepare insert data
      const insertData: any = {
        title: formData.title,
        slug: finalSlug,
        excerpt: formData.excerpt,
        content_blocks: contentBlocks,
        categories: formData.categories,
        tags: formData.tags,
        sources: formData.sources,
      }

      // Only include main_image if it's provided
      if (formData.main_image && formData.main_image.trim()) {
        insertData.main_image = formData.main_image.trim()
      }

      // Only include created_at if it's different from now
      if (formData.created_at) {
        const selectedDate = new Date(formData.created_at)
        const now = new Date()
        // If the selected date is more than 1 minute different, use it
        if (Math.abs(selectedDate.getTime() - now.getTime()) > 60000) {
          insertData.created_at = selectedDate.toISOString()
        }
      }

      const { error } = await supabase
        .from(tableName)
        .insert([insertData])

      if (!error) {
        router.push(`/${locale}/admin`)
      } else {
        alert('오류가 발생했습니다: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('글 작성에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const convertMarkdownToBlocks = (markdown: string) => {
    const blocks: any[] = []
    const lines = markdown.split('\n')
    let currentParagraph = ''
    let inTable = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // Empty line
      if (!trimmedLine) {
        if (currentParagraph) {
          // If we're in a table, preserve the empty line as part of the table
          // (tables can have empty lines between rows in markdown)
          if (inTable) {
            currentParagraph += '\n'
          } else {
            // For regular paragraphs, save and reset
            blocks.push({
              type: 'paragraph',
              content: { text: currentParagraph.trimEnd() }
            })
            currentParagraph = ''
          }
        }
        continue
      }

      // Check if line is a table row (starts with | and ends with |)
      const isTableRow = /^\s*\|.+\|\s*$/.test(line)
      const isTableSeparator = /^\s*\|[\s\-:]+\|\s*$/.test(line)

      // Check if line is a standalone URL
      const urlPattern = /^https?:\/\/[^\s]+$/i
      const isStandaloneUrl = urlPattern.test(trimmedLine)

      // If standalone URL, save previous paragraph and create new paragraph for URL
      if (isStandaloneUrl) {
        if (currentParagraph) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trimEnd() }
          })
          currentParagraph = ''
        }
        // Save URL as its own paragraph block
        blocks.push({
          type: 'paragraph',
          content: { text: trimmedLine } // Store clean URL without extra whitespace
        })
        inTable = false
        continue
      }

      // Heading (H2)
      if (trimmedLine.startsWith('##')) {
        if (currentParagraph) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trim() }
          })
          currentParagraph = ''
          inTable = false
        }
        blocks.push({
          type: 'heading_h2',
          content: { text: trimmedLine.replace(/^##\s*/, '') }
        })
        continue
      }

      // Table row or separator - preserve line breaks
      if (isTableRow || isTableSeparator) {
        if (!inTable && currentParagraph) {
          // Save previous paragraph before starting table
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph.trimEnd() }
          })
          currentParagraph = ''
        }
        inTable = true
        // Add line with preserved line break (don't trim!)
        currentParagraph += (currentParagraph ? '\n' : '') + line
        continue
      }

      // Regular text after table ends
      if (inTable) {
        // End of table, save it (preserve line breaks in table)
        if (currentParagraph) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph } // Don't trim - preserve table formatting
          })
          currentParagraph = ''
        }
        inTable = false
      }
      
      // For regular text, preserve line breaks if previous line was not empty
      // This helps with formatting like lists, code blocks, etc.
      if (currentParagraph && !currentParagraph.endsWith('\n')) {
        currentParagraph += '\n' + line
      } else {
        currentParagraph += (currentParagraph ? line : line)
      }
    }

    if (currentParagraph) {
      blocks.push({
        type: 'paragraph',
        content: { text: currentParagraph.trimEnd() } // Preserve leading spaces/newlines, remove trailing ones
      })
    }

    return blocks
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✏️ 새 글 작성</h1>
        <p className="text-gray-600">새로운 글을 작성하고 게시하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            언어 선택 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.locale}
            onChange={(e) => setFormData({ ...formData, locale: e.target.value as Locale, categories: [] })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {locales.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'ja' ? '🇯🇵 일본어' : loc === 'en' ? '🇺🇸 영어' : '🇰🇷 한국어'}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="글 제목을 입력하세요"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL 슬러그 (자동 생성)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="비워두면 제목에서 자동 생성됩니다"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            요약 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="글의 간단한 요약을 입력하세요"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            썸네일 이미지 URL <span className="text-gray-500 font-normal">(선택사항)</span>
          </label>
          <input
            type="url"
            value={formData.main_image}
            onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
            placeholder="https://example.com/image.jpg (비워두셔도 됩니다)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {formData.main_image && formData.main_image.trim() && (
            <div className="mt-3">
              <img src={formData.main_image} alt="Preview" className="h-32 w-48 object-cover rounded-lg border-2 border-gray-200" />
            </div>
          )}
        </div>

        {/* Published Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            발행일시 <span className="text-gray-500 font-normal">(선택사항)</span>
          </label>
          <input
            type="datetime-local"
            value={formData.created_at}
            onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <p className="mt-2 text-xs text-gray-500">
            비워두면 현재 시간으로 저장됩니다
          </p>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-lg border-2 transition font-medium ${
                  formData.categories.includes(category)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            태그
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="태그를 입력하고 Enter를 누르세요"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content - Markdown Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            본문 (Markdown 형식) <span className="text-red-500">*</span>
          </label>
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">
              <strong>💡 링크 미리보기 카드 만들기:</strong>
            </p>
            <p className="text-xs text-blue-800 mb-1">
              링크를 한 줄에 입력하면 자동으로 미리보기 카드가 생성됩니다:
            </p>
            <div className="space-y-1">
              <code className="text-xs bg-blue-100 px-2 py-1 rounded block font-mono">
                https://example.com
              </code>
              <p className="text-xs text-blue-600 text-center">또는</p>
              <code className="text-xs bg-blue-100 px-2 py-1 rounded block font-mono">
                [텍스트](https://example.com)
              </code>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              (한 줄에만 입력하세요. 하테나/티스토리처럼 미리보기 카드로 표시됩니다)
            </p>
          </div>
          <textarea
            ref={editorRef}
            defaultValue={formData.content}
            className="w-full min-h-[400px] border-2 border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin`)}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 transition shadow-md hover:shadow-lg font-medium"
          >
            {loading ? '저장 중...' : '글 게시하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

