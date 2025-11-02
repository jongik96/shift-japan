import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale, getLocaleFromAcceptLanguage } from './lib/i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 정적 파일과 API 라우트는 건너뛰기
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // URL에서 locale 추출
  const pathnameSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathnameSegments[0]

  // 이미 locale이 있는 경우
  if (isValidLocale(firstSegment)) {
    return NextResponse.next()
  }

  // 루트 경로 (/) 접속 시
  if (pathname === '/') {
    // Accept-Language 헤더에서 브라우저 언어 감지
    const acceptLanguage = request.headers.get('accept-language')
    const detectedLocale = getLocaleFromAcceptLanguage(acceptLanguage)
    
    const url = request.nextUrl.clone()
    url.pathname = `/${detectedLocale}`
    return NextResponse.redirect(url)
  }

  // locale이 없는 다른 경로는 기본 locale로 리다이렉트
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
