'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'

interface ShareBarProps {
  title: string
  isFixed?: boolean
}

export default function ShareBar({ title, isFixed = true }: ShareBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [dictionary, setDictionary] = useState<any>(null)
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string || 'ja') as Locale
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getDictionary(locale).then(setDictionary)
  }, [locale])

  useEffect(() => {
    // Set URL only on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [pathname])

  useEffect(() => {
    if (!isFixed) return

    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [isFixed])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!dictionary) {
    return null
  }

  const shareButtons = (
    <div className="flex flex-col space-y-3">
      <h4 className="font-semibold text-gray-900 mb-2">{dictionary.share.title}</h4>
      
      <button
        onClick={() => handleCopy(currentUrl)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
      >
        {copied ? (
          <>
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-600 font-medium">{dictionary.share.copied}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-blue-600">{dictionary.share.copyLink}</span>
          </>
        )}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
      >
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
        <span className="text-sm text-gray-700">{dictionary.share.twitter}</span>
      </a>

      <button
        onClick={() => {
          const selection = window.getSelection()
          if (selection && selection.toString().trim()) {
            handleCopy(`"${selection.toString()}" - ${title}`)
          }
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="text-sm text-gray-700">{dictionary.share.quoteSelection}</span>
      </button>
    </div>
  )

  if (isFixed) {
    return (
      <aside className={`fixed right-8 top-1/2 -translate-y-1/2 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <div className="bg-white rounded-lg shadow-lg p-4 w-48 border border-gray-200">
          {shareButtons}
        </div>
      </aside>
    )
  }

  return (
    <aside className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {shareButtons}
    </aside>
  )
}
