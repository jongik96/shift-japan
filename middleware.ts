import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n/config'

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
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  let detectedLocale = defaultLocale

  // Parse Accept-Language header
  const preferredLanguages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, priority] = lang.trim().split(';q=')
      return {
        locale: locale.split('-')[0].toLowerCase(),
        priority: priority ? parseFloat(priority) : 1.0,
      }
    })
    .sort((a, b) => b.priority - a.priority)

  // Find first matching locale
  for (const pref of preferredLanguages) {
    if (pref.locale === 'ko' || pref.locale === 'ja' || pref.locale === 'en') {
      detectedLocale = pref.locale as typeof defaultLocale
      break
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

