import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge Runtime compatible constants - defined directly in middleware
const locales = ['ja', 'en', 'ko'] as const
const defaultLocale = 'ja'
type Locale = 'ja' | 'en' | 'ko'

function isValidLocale(locale: string): locale is Locale {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a valid locale
  const hasJa = pathname === '/ja' || pathname.startsWith('/ja/')
  const hasEn = pathname === '/en' || pathname.startsWith('/en/')
  const hasKo = pathname === '/ko' || pathname.startsWith('/ko/')
  const pathnameHasLocale = hasJa || hasEn || hasKo

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  let detectedLocale: Locale = defaultLocale

  // Simple locale detection - Edge Runtime compatible
  if (acceptLanguage) {
    // Parse Accept-Language header manually (no .map() or .sort())
    const languages: Array<{ locale: string; priority: number }> = []
    const parts = acceptLanguage.split(',')
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim()
      const qIndex = part.indexOf(';q=')
      let locale = ''
      let priority = 1.0
      
      if (qIndex > 0) {
        locale = part.substring(0, qIndex).split('-')[0].toLowerCase()
        const qValue = part.substring(qIndex + 3)
        priority = parseFloat(qValue) || 1.0
      } else {
        locale = part.split('-')[0].toLowerCase()
        priority = 1.0
      }
      
      languages.push({ locale, priority })
    }
    
    // Simple bubble sort (Edge Runtime compatible)
    for (let i = 0; i < languages.length - 1; i++) {
      for (let j = 0; j < languages.length - 1 - i; j++) {
        if (languages[j].priority < languages[j + 1].priority) {
          const temp = languages[j]
          languages[j] = languages[j + 1]
          languages[j + 1] = temp
        }
      }
    }
    
    // Find first matching locale
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i].locale
      if (lang === 'ko' || lang === 'ja' || lang === 'en') {
        detectedLocale = lang as Locale
        break
      }
    }
  }

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone()
  if (pathname === '/') {
    url.pathname = `/${detectedLocale}`
  } else {
    url.pathname = `/${detectedLocale}${pathname}`
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

