import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip static files and API routes - very simple checks only
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    return NextResponse.next()
  }

  // Check for file extensions
  let hasExtension = false
  if (pathname.length > 0) {
    const lastDot = pathname.lastIndexOf('.')
    if (lastDot > 0 && lastDot < pathname.length - 1) {
      hasExtension = true
    }
  }

  if (hasExtension) {
    return NextResponse.next()
  }

  // Check if pathname already has a valid locale - direct string checks only
  const hasJa = pathname === '/ja' || (pathname.length > 3 && pathname.substring(0, 3) === '/ja')
  const hasEn = pathname === '/en' || (pathname.length > 3 && pathname.substring(0, 3) === '/en')
  const hasKo = pathname === '/ko' || (pathname.length > 3 && pathname.substring(0, 3) === '/ko')

  if (hasJa || hasEn || hasKo) {
    return NextResponse.next()
  }

  // Simple redirect to default locale (ja) - no language detection to avoid any complexity
  const url = request.nextUrl.clone()
  if (pathname === '/') {
    url.pathname = '/ja'
  } else {
    url.pathname = '/ja' + pathname
  }

  return NextResponse.redirect(url)
}

export const config = {
  runtime: 'nodejs', // Use Node.js runtime to avoid Edge Runtime __dirname issues
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

