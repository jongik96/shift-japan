'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Import easymde CSS only on client side
if (typeof window !== 'undefined') {
  require('easymde/dist/easymde.min.css')
}

let EasyMDE: any = null
if (typeof window !== 'undefined') {
  EasyMDE = require('easymde')
}

const categories = ['移住・生活', 'キャリア・ビジネス', '金融・投資', '税務・法令', '文化・社会', 'データ分析']

export default function NewPostPage() {
  const router = useRouter()
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
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editorRef.current && EasyMDE && !editorInstance.current) {
      editorInstance.current = new EasyMDE({
        element: editorRef.current,
        placeholder: 'Markdown形式で記事を書いてください...',
        spellChecker: false,
        status: false,
      })
      
      editorInstance.current.codemirror.on('change', () => {
        const value = editorInstance.current.value()
        setFormData(prev => ({ ...prev, content: value }))
      })
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea()
        editorInstance.current = null
      }
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

      const { error } = await supabase
        .from('insight_posts')
        .insert([{
          title: formData.title,
          slug: finalSlug,
          excerpt: formData.excerpt,
          main_image: formData.main_image,
          content_blocks: contentBlocks,
          categories: formData.categories,
          tags: formData.tags,
          sources: formData.sources,
        }])

      if (!error) {
        router.push('/admin')
      } else {
        alert('エラーが発生しました: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('投稿の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const convertMarkdownToBlocks = (markdown: string) => {
    const blocks: any[] = []
    const lines = markdown.split('\n')
    let currentParagraph = ''
    let currentHeading = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Empty line
      if (!line) {
        if (currentParagraph) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph }
          })
          currentParagraph = ''
        }
        continue
      }

      // Heading (H2)
      if (line.startsWith('##')) {
        if (currentParagraph) {
          blocks.push({
            type: 'paragraph',
            content: { text: currentParagraph }
          })
          currentParagraph = ''
        }
        blocks.push({
          type: 'heading_h2',
          content: { text: line.replace(/^##\s*/, '') }
        })
        continue
      }

      // Regular text
      currentParagraph += (currentParagraph ? ' ' : '') + line
    }

    if (currentParagraph) {
      blocks.push({
        type: 'paragraph',
        content: { text: currentParagraph }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">新規投稿作成</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URLスラッグ (自動生成)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="空白の場合、タイトルから自動生成されます"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            要約 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サムネイル画像URL
          </label>
          <input
            type="url"
            value={formData.main_image}
            onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.main_image && (
            <img src={formData.main_image} alt="Preview" className="mt-2 h-32 w-48 object-cover rounded" />
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリー
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-lg border transition ${
                  formData.categories.includes(category)
                    ? 'bg-blue-600 text-white border-blue-600'
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ
          </label>
          <div className="flex gap-2 mb-2">
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
              placeholder="タグを入力してEnter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content - Markdown Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文（Markdown形式） <span className="text-red-500">*</span>
          </label>
          <textarea
            ref={editorRef}
            defaultValue={formData.content}
            className="w-full min-h-[400px]"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? '保存中...' : '投稿を公開'}
          </button>
        </div>
      </form>
    </div>
  )
}
