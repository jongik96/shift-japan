import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // Skip if has file extension
  if (pathname.indexOf('.') > 0) {
    return NextResponse.next()
  }

  // Check if already has locale
  if (
    pathname === '/ja' ||
    pathname === '/en' ||
    pathname === '/ko' ||
    (pathname.length > 3 && pathname.substring(0, 3) === '/ja') ||
    (pathname.length > 3 && pathname.substring(0, 3) === '/en') ||
    (pathname.length > 3 && pathname.substring(0, 3) === '/ko')
  ) {
    return NextResponse.next()
  }

  // Redirect to default locale
  return NextResponse.redirect(new URL('/ja' + (pathname === '/' ? '' : pathname), request.url))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}

