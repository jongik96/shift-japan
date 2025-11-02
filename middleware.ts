import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if pathname has locale prefix
  const hasJa = pathname === '/ja' || pathname.startsWith('/ja/')
  const hasEn = pathname === '/en' || pathname.startsWith('/en/')
  const hasKo = pathname === '/ko' || pathname.startsWith('/ko/')
  const hasLocale = hasJa || hasEn || hasKo

  // If no locale, redirect to /ja
  if (!hasLocale && pathname !== '/favicon.ico') {
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/ja' : `/ja${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

