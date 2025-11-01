'use client'

import { ContentBlock } from '@/lib/types'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface ContentRendererProps {
  blocks: ContentBlock[]
  onHeadingRender?: (id: string, text: string) => void
}

const COLORS = ['#0284c7', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#db2777']

export default function ContentRenderer({ blocks, onHeadingRender }: ContentRendererProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading_h2':
        const headingId = `heading-${index}`
        if (onHeadingRender) {
          onHeadingRender(headingId, block.content.text)
        }
        return (
          <h2 id={headingId} key={index} className="text-3xl font-bold mt-12 mb-6 pb-3 border-b-2 border-gray-200">
            {block.content.text}
          </h2>
        )
      
      case 'paragraph':
        return (
          <p key={index} className="mb-6 text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content.text }} />
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
          <div key={index} className="my-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  {block.content.headers.map((header: string, idx: number) => (
                    <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {block.content.rows.map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 transition">
                    {row.map((cell: string, cellIdx: number) => (
                      <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
          <div key={index} className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg" data-quote data-author={block.content.author || ''}>
            <p className="text-lg italic text-gray-800 leading-relaxed">
              "{block.content.text}"
            </p>
            {block.content.author && (
              <p className="mt-2 text-sm text-gray-600">— {block.content.author}</p>
            )}
          </div>
        )
      
      case 'definition_box':
        return (
          <div key={index} className="my-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-xl font-bold mb-2 text-blue-600">{block.content.term}</h4>
            <p className="text-gray-700 leading-relaxed mb-4">{block.content.definition}</p>
            {block.content.related_terms && block.content.related_terms.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">関連用語:</p>
                <ul className="list-disc list-inside space-y-1">
                  {block.content.related_terms.map((term: string, termIdx: number) => (
                    <li key={termIdx} className="text-sm text-gray-700">{term}</li>
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
