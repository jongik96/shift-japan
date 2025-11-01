'use client'

import { useState } from 'react'
import TOC from '@/components/TOC'
import { TOCItem } from '@/lib/types'

interface MobileTOCButtonProps {
  items: TOCItem[]
}

export default function MobileTOCButton({ items }: MobileTOCButtonProps) {
  const [showTOC, setShowTOC] = useState(false)

  if (items.length === 0) return null

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg transition text-blue-700 font-semibold"
      >
        <span>目次を見る</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${showTOC ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showTOC && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <TOC items={items} isMobile={false} />
        </div>
      )}
    </div>
  )
}
