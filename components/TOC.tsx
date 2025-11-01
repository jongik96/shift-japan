'use client'

import { TOCItem } from '@/lib/types'
import { useEffect, useState } from 'react'

interface TOCProps {
  items: TOCItem[]
  isMobile?: boolean
  onClose?: () => void
}

export default function TOC({ items, isMobile = false, onClose }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveId(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: '-20% 0% -35% 0%' }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (isMobile && onClose) {
        setTimeout(() => onClose(), 300)
      }
    }
  }

  if (items.length === 0) return null

  const tocContent = (
    <nav className={isMobile ? 'p-4' : 'sticky top-20'}>
      <h3 className="text-lg font-bold mb-4 text-gray-900">目次</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`text-left w-full px-3 py-2 rounded-lg transition-colors ${
                activeId === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {tocContent}
        </div>
      </div>
    )
  }

  return <aside className="w-64 flex-shrink-0 pr-8">{tocContent}</aside>
}
