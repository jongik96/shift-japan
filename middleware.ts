import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pure constants - no imports, no functions that could cause Edge Runtime issues
const locales = ['ja', 'en', 'ko']
const defaultLocale = 'ja'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for special routes, static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Simple locale check without using .some() method
  let hasLocale = false
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i]
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      hasLocale = true
      break
    }
  }

  // If pathname doesn't have a locale, redirect to default locale
  if (!hasLocale) {
    const redirectPath = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = redirectPath
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt and sitemap.xml
     * - files with extensions
     */
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

