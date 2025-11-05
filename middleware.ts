import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 주의: middleware는 기본적으로 Edge Runtime에서 실행됩니다.
// Next.js 14.0.4에서는 runtime 설정을 명시하지 않는 것이 안전합니다.

/**
 * Edge Runtime 안전한 middleware
 * 
 * 중요: 이 파일은 절대 다른 파일을 import하지 않습니다.
 * - lib/i18n/* 파일들을 import하지 않음
 * - Node.js API (fs, path, __dirname) 사용하지 않음
 * - 오직 Next.js 공식 타입만 사용 (NextResponse, NextRequest)
 * - 모든 설정값과 로직을 파일 내부에 직접 정의
 */

// Edge Runtime에서 직접 정의된 설정값들
const DEFAULT_LOCALE = 'ja'

// 브라우저 언어를 Locale로 변환 (최소화된 버전)
function getLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE
  
  const lang = acceptLanguage.toLowerCase().split(',')[0].split('-')[0].trim()
  
  if (lang === 'ko') return 'ko'
  if (lang === 'ja') return 'ja'
  if (lang === 'en') return 'en'
  
  return DEFAULT_LOCALE
}

// pathname에 locale prefix가 있는지 확인 (최소화된 버전)
function hasLocale(pathname: string): boolean {
  return (
    pathname === '/ja' ||
    pathname === '/en' ||
    pathname === '/ko' ||
    pathname.startsWith('/ja/') ||
    pathname.startsWith('/en/') ||
    pathname.startsWith('/ko/')
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 정적 파일, API 요청, Next.js 내부 경로 제외
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known')
  ) {
    return NextResponse.next()
  }

  // 정적 파일 확장자 제외
  if (/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(pathname)) {
    return NextResponse.next()
  }

  // 이미 locale prefix가 있으면 통과
  if (hasLocale(pathname)) {
    return NextResponse.next()
  }

  // locale prefix가 없으면 기본 언어(ja)로 리다이렉트
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  // Edge Runtime 호환을 위한 최소한의 matcher
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\..*).*)',
  ],
}
