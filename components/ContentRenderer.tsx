'use client'

import { ContentBlock } from '@/lib/types'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useEffect } from 'react'

interface ContentRendererProps {
  blocks: ContentBlock[]
  onHeadingRender?: (id: string, text: string) => void
}

const COLORS = ['#0284c7', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#db2777']

// Link Preview Card Component
function LinkPreviewCard({ href, children }: { href: string; children: React.ReactNode }) {
  const [metadata, setMetadata] = useState<{ title?: string; description?: string; image?: string; domain?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extract domain from URL
    let domain = ''
    try {
      const url = new URL(href)
      domain = url.hostname.replace('www.', '')
      setMetadata({ domain })
    } catch (e) {
      setLoading(false)
      return
    }

    // Fetch OG metadata for link preview
    const fetchOGMetadata = async () => {
      try {
        // Use a CORS proxy to fetch OG metadata
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(href)}`
        const response = await fetch(proxyUrl)
        const data = await response.json()
        const htmlContent = data.contents

        if (!htmlContent) {
          setLoading(false)
          return
        }

        // Parse HTML to extract OG metadata
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')

        const getMetaContent = (property: string) => {
          const meta = doc.querySelector(`meta[property="${property}"], meta[name="${property}"]`)
          return meta ? meta.getAttribute('content') : null
        }

        const ogTitle = getMetaContent('og:title') || doc.querySelector('title')?.textContent || ''
        const ogDescription = getMetaContent('og:description') || getMetaContent('description') || ''
        const ogImage = getMetaContent('og:image')
        
        // Handle relative image URLs
        let imageUrl = ogImage
        if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
          try {
            const baseUrl = new URL(href)
            imageUrl = new URL(ogImage, baseUrl.origin).href
            // If still relative, try with base href
            if (!imageUrl.startsWith('http')) {
              imageUrl = new URL(ogImage, href).href
            }
          } catch (e) {
            // Keep original if URL construction fails
            imageUrl = ogImage
          }
        }

        setMetadata({
          title: ogTitle,
          description: ogDescription,
          image: imageUrl || undefined,
          domain,
        })
      } catch (error) {
        console.warn('Failed to fetch OG metadata for', href, error)
      } finally {
        setLoading(false)
      }
    }

    fetchOGMetadata()
  }, [href])

  const title = typeof children === 'string' ? children : href
  const displayTitle = metadata?.title || title || href
  
  let displayDomain = href
  try {
    const url = new URL(href)
    displayDomain = metadata?.domain || url.hostname.replace('www.', '')
  } catch (e) {
    displayDomain = metadata?.domain || href
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-4 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all group"
    >
      <div className="flex flex-col sm:flex-row">
        {metadata?.image && (
          <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-100 flex-shrink-0">
            <img
              src={metadata.image}
              alt={displayTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-base sm:text-lg line-clamp-2 mb-1">
                {displayTitle}
              </h4>
              {metadata?.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {metadata.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs text-gray-500 truncate">{displayDomain}</span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function ContentRenderer({ blocks, onHeadingRender }: ContentRendererProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading_h2':
        const headingId = `heading-${index}`
        if (onHeadingRender) {
          onHeadingRender(headingId, block.content.text)
        }
        return (
          <h2 id={headingId} key={index} className="text-2xl sm:text-3xl font-bold mt-8 sm:mt-12 mb-4 sm:mb-6 pb-3 border-b-2 border-gray-200 text-gray-900">
            {block.content.text}
          </h2>
        )
      
      case 'paragraph':
        // Check if paragraph contains only a URL (for link preview cards)
        const text = block.content.text || ''
        const trimmedForUrlCheck = text.trim()
        
        // Early return for empty text
        if (!trimmedForUrlCheck) {
          return null
        }
        
        // Check for standalone URL - 더 강력한 패턴 매칭
        const urlPattern = /^https?:\/\/[^\s]+$/i
        const isStandaloneUrl = urlPattern.test(trimmedForUrlCheck)
        
        // Check for markdown link format: [text](url)
        const markdownLinkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/i
        const markdownLinkMatch = trimmedForUrlCheck.match(markdownLinkPattern)
        const isMarkdownLink = markdownLinkMatch !== null && 
          (markdownLinkMatch[2].startsWith('http://') || markdownLinkMatch[2].startsWith('https://'))
        
        // URL이 감지되면 LinkPreviewCard로 렌더링 (early return)
        if (isStandaloneUrl || (trimmedForUrlCheck.startsWith('http://') || trimmedForUrlCheck.startsWith('https://'))) {
          const urlToUse = isStandaloneUrl ? trimmedForUrlCheck : trimmedForUrlCheck
          return (
            <div key={`paragraph-url-${index}`} className="mb-6">
              <LinkPreviewCard href={urlToUse}>{urlToUse}</LinkPreviewCard>
            </div>
          )
        }
        
        // Markdown link format 처리
        if (isMarkdownLink && markdownLinkMatch) {
          const linkText = markdownLinkMatch[1]
          const linkUrl = markdownLinkMatch[2]
          return (
            <div key={`paragraph-mdlink-${index}`} className="mb-6">
              <LinkPreviewCard href={linkUrl}>{linkText}</LinkPreviewCard>
            </div>
          )
        }
        
        // Check if text contains markdown table
        const hasPipeChars = /\|.+\|/.test(text)
        const hasTableSeparator = /\|[\s\-:]+\|/.test(text)
        const hasTablePattern = hasPipeChars && hasTableSeparator
        
        // If table pattern detected, ensure proper formatting
        let tableText = text
        if (hasTablePattern) {
          const hasNewlines = text.includes('\n')
          
          if (!hasNewlines || (text.match(/\n/g) || []).length < 2) {
            tableText = text.trim()
              .replace(/(\|[^|\n]+?\|)\s+(?=\|)/g, '$1\n')
              .replace(/(\|[^|\n]+\|)\s+(?=\|[^|\n])/g, '$1\n')
              .replace(/\n\n+/g, '\n')
              
            tableText = tableText
              .split('\n')
              .map((line: string) => {
                line = line.trim()
                if (line && !line.startsWith('|')) {
                  line = '| ' + line
                }
                if (line && !line.endsWith('|')) {
                  line = line + ' |'
                }
                return line
              })
              .filter((line: string) => line.length > 0)
              .join('\n')
          } else {
            tableText = text
              .split('\n')
              .map((line: string) => {
                line = line.trim()
                if (/(\|[^|\n]+\|)\s+(?=\|)/.test(line)) {
                  return line.replace(/(\|[^|\n]+\|)\s+(?=\|)/g, '$1\n')
                }
                return line
              })
              .join('\n')
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0 && line.includes('|'))
              .join('\n')
          }
          
          tableText = tableText.trim()
        }
        
        // Render all paragraph content as markdown (including tables)
        const contentToRender = hasTablePattern ? tableText : text
        return (
          <div key={index} className="mb-6 text-gray-900 leading-relaxed">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                p: ({node, children, ...props}: any) => {
                  // Check if paragraph contains only a link (standalone link = preview card)
                  const paragraphChildren = (node.children || []) as any[]
                  const hasOnlyLink = paragraphChildren.length === 1 && 
                    paragraphChildren[0]?.type === 'link' &&
                    paragraphChildren[0]?.url &&
                    (paragraphChildren[0]?.url.startsWith('http://') || paragraphChildren[0]?.url.startsWith('https://'))
                  
                  if (hasOnlyLink) {
                    const linkUrl = paragraphChildren[0].url
                    const linkText = paragraphChildren[0].children?.[0]?.value || linkUrl
                    return (
                      <div className="mb-4">
                        <LinkPreviewCard href={linkUrl}>{linkText}</LinkPreviewCard>
                      </div>
                    )
                  }
                  
                  // Regular paragraph
                  return <p className="mb-4 text-gray-900" {...props}>{children}</p>
                },
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                em: ({node, ...props}) => <em className="italic text-gray-900" {...props} />,
                code: ({node, inline, ...props}: any) => 
                  inline ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900" {...props} />
                  ) : (
                    <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-900" {...props} />
                  ),
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-900" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-900" {...props} />,
                li: ({node, ...props}) => <li className="ml-4 text-gray-900" {...props} />,
                a: ({node, href, children, ...props}: any) => {
                  // For inline links (not standalone), keep as regular link
                  return (
                    <a 
                      className="text-blue-600 hover:text-blue-800 underline" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={href}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-900" {...props} />
                ),
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                hr: ({node, ...props}) => <hr className="my-6 border-gray-300" {...props} />,
                table: ({node, ...props}: any) => (
                  <div className="my-6 sm:my-8 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm" {...props} />
                  </div>
                ),
                thead: ({node, ...props}: any) => (
                  <thead className="bg-gray-50" {...props} />
                ),
                tbody: ({node, ...props}: any) => (
                  <tbody className="divide-y divide-gray-200" {...props} />
                ),
                tr: ({node, ...props}: any) => (
                  <tr className="hover:bg-gray-50 transition" {...props} />
                ),
                th: ({node, ...props}: any) => (
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b" {...props} />
                ),
                td: ({node, ...props}: any) => (
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900" {...props} />
                ),
              }}
            >
              {contentToRender}
            </ReactMarkdown>
          </div>
        )
      
      case 'interactive_chart':
        const ChartComponent = getChartComponent(block.content.chart_type)
        return (
          <div key={index} className="my-8 w-full overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">{block.content.title}</h3>
            <div className="min-h-[300px]">
              <ChartComponent data={block.content} />
            </div>
          </div>
        )
      
      case 'comparison_table':
        return (
          <div key={index} className="my-6 sm:my-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  {block.content.headers.map((header: string, idx: number) => (
                    <th key={idx} className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {block.content.rows.map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 transition">
                    {row.map((cell: string, cellIdx: number) => (
                      <td key={cellIdx} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      case 'pull_quote':
        return (
          <div key={index} className="my-6 sm:my-8 p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg" data-quote data-author={block.content.author || ''}>
            <p className="text-base sm:text-lg italic text-gray-900 leading-relaxed">
              "{block.content.text}"
            </p>
            {block.content.author && (
              <p className="mt-2 text-sm text-gray-900">— {block.content.author}</p>
            )}
          </div>
        )
      
      case 'definition_box':
        return (
          <div key={index} className="my-6 sm:my-8 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-blue-600">{block.content.term}</h4>
            <p className="text-gray-900 leading-relaxed mb-4">{block.content.definition}</p>
            {block.content.related_terms && block.content.related_terms.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">関連用語:</p>
                <ul className="list-disc list-inside space-y-1">
                  {block.content.related_terms.map((term: string, termIdx: number) => (
                    <li key={termIdx} className="text-sm text-gray-900">{term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="prose-custom max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

function getChartComponent(type: string) {
  return function Chart({ data }: { data: any }) {
    const chartData = data.data || []
    const xKey = data.x_key || 'name'
    const yKey = data.y_key || 'value'

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#0284c7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yKey}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }
}
