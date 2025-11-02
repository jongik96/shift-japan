'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { locales, type Locale } from '@/lib/i18n/config'

const languageNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
}

const languageFlags: Record<Locale, string> = {
  ja: '🇯🇵',
  en: '🇺🇸',
  ko: '🇰🇷',
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('common')
  const locale = (router.locale || 'ja') as Locale

  // Get current path without locale prefix
  const currentPath = router.asPath || '/'

  const getLocalizedPath = (targetLocale: Locale) => {
    // Next.js i18n automatically handles locale prefix
    return router.asPath || '/'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🇯🇵 Shift Japan Insight
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.blog')}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.contact')}
            </Link>
            
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                <span className="text-lg">{languageFlags[locale]}</span>
                <span>{languageNames[locale]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={router.asPath || '/'}
                    locale={loc}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition ${
                      locale === loc ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{languageFlags[loc]}</span>
                    <span>{languageNames[loc]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label={t('nav.menu')}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">
              {t('nav.blog')}
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">
              {t('nav.contact')}
            </Link>
            <div className="border-t border-gray-200 mt-2 pt-2">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={router.asPath || '/'}
                  locale={loc}
                  className={`block px-3 py-2 text-base font-medium ${
                    locale === loc ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {languageFlags[loc]} {languageNames[loc]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
