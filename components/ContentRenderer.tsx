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
        // Use trimEnd() to preserve leading/trailing newlines but remove trailing spaces
        const text = block.content.text || ''
        const trimmedForUrlCheck = text.trim()
        
        // Check for standalone URL - 더 강력한 패턴 매칭
        const urlPattern = /^https?:\/\/[^\s]+$/i
        const isStandaloneUrl = urlPattern.test(trimmedForUrlCheck)
        
        // Check for markdown link format: [text](url)
        const markdownLinkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/i
        const markdownLinkMatch = trimmedForUrlCheck.match(markdownLinkPattern)
        const isMarkdownLink = markdownLinkMatch !== null && 
          (markdownLinkMatch[2].startsWith('http://') || markdownLinkMatch[2].startsWith('https://'))
        
        // Debug: Log URL detection (디버깅 활성화)
        console.log('🔍 Paragraph block URL 감지:', {
          original: JSON.stringify(block.content.text),
          text: text,
          trimmed: trimmedForUrlCheck,
          isStandaloneUrl,
          isMarkdownLink,
          markdownLinkMatch,
          urlPatternTest: urlPattern.test(trimmedForUrlCheck)
        })
        
        // Check if text contains markdown table
        // Table pattern: has pipe characters, separator row with dashes/colons, and data rows
        // Also handle tables that may have been saved without proper line breaks (e.g., "| a | b | |---|---|")
        const hasPipeChars = /\|.+\|/.test(text)
        const hasTableSeparator = /\|[\s\-:]+\|/.test(text)
        const hasTablePattern = hasPipeChars && hasTableSeparator
        
        // If table pattern detected, ensure proper formatting
        let tableText = text
        if (hasTablePattern) {
          // Check if table is on one line (needs fixing)
          const hasNewlines = text.includes('\n')
          
          if (!hasNewlines || (text.match(/\n/g) || []).length < 2) {
            // Table is on one line or has very few line breaks - need to split rows
            // Pattern example: "| col1 | col2 | |---|---| | data1 | data2 |"
            // Each row ends with "|" and next row starts with "|"
            // Rows are separated by one or more spaces
            
            // Method: Find all "| ... |" patterns and split by spaces followed by "|"
            // First, normalize spaces around pipes
            tableText = text.trim()
            
            // Split by pattern: "|" followed by content, then "|", then space(s), then "|"
            // This pattern: (\|[^|]+\|) followed by space and then (\|)
            // More aggressive: split where we have "| ... |" followed by space and "|"
            const parts: string[] = []
            let currentRow = ''
            let inCell = false
            
            // Split table rows: the key is finding row boundaries
            // Each row is: | cell1 | cell2 | cell3 |
            // Rows are separated by one or more spaces between the closing | and opening |
            // Pattern: "| ... |" (complete row) followed by space(s) and "|" (start of next row)
            
            // More robust: find complete table rows by matching pipe patterns
            // A complete row has at least 2 pipes (start and end, possibly more for multiple cells)
            // Split at: "|" followed by space(s) followed by "|" (but only at row boundaries)
            
            // Strategy: Replace "|" followed by space(s) and "|" with "|\n|"
            // But only if it looks like a row boundary (not inside a single row)
            // A row boundary is: row ending "|" + space + row starting "|"
            
            // Split table rows - rows are complete "| ... |" patterns separated by spaces
            // The challenge: distinguish between row separators and cell content
            
            // Strategy: Look for complete rows (contain at least 2 pipes) followed by space and another row
            // Pattern: "| cell1 | cell2 | ... |" (complete row) followed by space(s) and "|" (next row start)
            
            // More aggressive: Split where we see "|" (potential row end) followed by space and "|" (next row start)
            // But only if there's already a "|" before it (it's part of a row)
            tableText = tableText
              // First, find complete rows ending with "|" and split before next row starting with "|"
              // Pattern: Any "| ... |" (with content between pipes) followed by space and "|"
              // This matches: "| col1 | col2 |" + space + "|" (next row)
              .replace(/(\|[^|\n]+?\|)\s+(?=\|)/g, '$1\n')
              // Also handle the reverse: "|" at end, space, then "|" (but with content before)
              // This is a fallback for cases where the first pattern didn't match
              .replace(/(\|[^|\n]+\|)\s+(?=\|[^|\n])/g, '$1\n')
              // Clean up any double splits
              .replace(/\n\n+/g, '\n')
            
            // Clean up: ensure each row is properly formatted
            tableText = tableText
              .split('\n')
              .map((line: string) => {
                line = line.trim()
                // Ensure row starts and ends with |
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
            // Table has line breaks but individual lines might have multiple rows merged
            // Example: "| col1 | col2 | |---|---|" (header and separator on same line)
            // Need to split rows within each line
            tableText = text
              .split('\n')
              .map((line: string) => {
                line = line.trim()
                // If line contains multiple rows (pattern: "| ... |" + space + "|")
                // Split them
                if (/(\|[^|\n]+\|)\s+(?=\|)/.test(line)) {
                  // This line has multiple rows, split them
                  return line.replace(/(\|[^|\n]+\|)\s+(?=\|)/g, '$1\n')
                }
                return line
              })
              .join('\n')
              // Split again in case we created new rows, then clean up
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0 && line.includes('|'))
              .join('\n')
          }
          
          // Final cleanup
          tableText = tableText.trim()
        }
        
        // Common markdown components
        const markdownComponents = {
          p: ({node, ...props}: any) => <p className="mb-4 text-gray-900" {...props} />,
          strong: ({node, ...props}: any) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({node, ...props}: any) => <em className="italic text-gray-900" {...props} />,
          code: ({node, inline, ...props}: any) => 
            inline ? (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900" {...props} />
            ) : (
              <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-900" {...props} />
            ),
          ul: ({node, ...props}: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-900" {...props} />,
          ol: ({node, ...props}: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-900" {...props} />,
          li: ({node, ...props}: any) => <li className="ml-4 text-gray-900" {...props} />,
          a: ({node, href, children, ...props}: any) => {
            const isStandaloneLink = node.parent?.type === 'paragraph' && 
              node.parent?.children?.length === 1 && 
              node.parent?.children[0]?.type === 'link'
            
            if (isStandaloneLink && href && (href.startsWith('http://') || href.startsWith('https://'))) {
              return <LinkPreviewCard key={href} href={href}>{children}</LinkPreviewCard>
            }
            
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
          blockquote: ({node, ...props}: any) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-900" {...props} />
          ),
          h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
          h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
          h3: ({node, ...props}: any) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
          hr: ({node, ...props}: any) => <hr className="my-6 border-gray-300" {...props} />,
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
        }
        
        // If it's a standalone URL or markdown link, show as link preview card
        if (isStandaloneUrl) {
          // Use trimmed URL for href to ensure clean URL
          const cleanUrl = trimmedForUrlCheck
          console.log('✅ Standalone URL 감지됨, LinkPreviewCard 렌더링:', cleanUrl)
          return (
            <div key={index} className="mb-6">
              <LinkPreviewCard href={cleanUrl}>{cleanUrl}</LinkPreviewCard>
            </div>
          )
        }
        
        // If it's a markdown link format, show as preview card
        if (isMarkdownLink && markdownLinkMatch) {
          const linkText = markdownLinkMatch[1]
          const linkUrl = markdownLinkMatch[2]
          console.log('✅ Markdown link 감지됨, LinkPreviewCard 렌더링:', linkUrl)
          return (
            <div key={index} className="mb-6">
              <LinkPreviewCard href={linkUrl}>{linkText}</LinkPreviewCard>
            </div>
          )
        }
        
        // URL이 감지되지 않았지만, 텍스트가 URL처럼 보이면 강제로 체크
        if (trimmedForUrlCheck && (trimmedForUrlCheck.startsWith('http://') || trimmedForUrlCheck.startsWith('https://'))) {
          console.log('⚠️ URL 패턴이지만 감지되지 않음, 강제로 LinkPreviewCard 렌더링:', trimmedForUrlCheck)
          return (
            <div key={index} className="mb-6">
              <LinkPreviewCard href={trimmedForUrlCheck}>{trimmedForUrlCheck}</LinkPreviewCard>
            </div>
          )
        }
        
        // Render all paragraph content as markdown (including tables)
        // ReactMarkdown with remarkGfm will handle tables correctly
        // For tables, ensure proper line breaks are preserved
        const contentToRender = hasTablePattern ? tableText : block.content.text
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
