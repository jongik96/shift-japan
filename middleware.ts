import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge Runtime에서 직접 정의 - import 사용 최소화
const locales = ['ja', 'en', 'ko']
const defaultLocale = 'ja'

function isValidLocale(locale: string): boolean {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale
  
  const lower = acceptLanguage.toLowerCase()
  
  // 간단한 문자열 검색으로 처리
  if (lower.includes('ko')) return 'ko'
  if (lower.includes('ja')) return 'ja'
  if (lower.includes('en')) return 'en'
  
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 정적 파일과 API 라우트는 건너뛰기
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // URL에서 첫 번째 세그먼트 추출
  const segments = pathname.split('/')
  const firstSegment = segments[1] || ''

  // 이미 locale이 있는 경우 통과
  if (isValidLocale(firstSegment)) {
    return NextResponse.next()
  }

  // 루트 경로 (/) 접속 시
  if (pathname === '/') {
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
