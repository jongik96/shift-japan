import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n/routing'

export function middleware(request: NextRequest) {
  try {
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

    // Check if pathname starts with a locale
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // If pathname doesn't have a locale, redirect to default locale
    if (!pathnameHasLocale) {
      const locale = defaultLocale
      // Handle root path
      const redirectPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
      
      // Use request.nextUrl.clone() for safer URL manipulation
      const url = request.nextUrl.clone()
      url.pathname = redirectPath
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    // Catch any unexpected errors in middleware
    // In production, we should log this to a monitoring service
    // For now, just return next to prevent blocking the request
    return NextResponse.next()
  }
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

