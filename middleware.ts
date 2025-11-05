import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge Runtime 안전한 middleware
 * 
 * 중요: 이 파일은 절대 다른 파일을 import하지 않습니다.
 * - lib/i18n/* 파일들을 import하지 않음
 * - Node.js API (fs, path, __dirname) 사용하지 않음
 * - 오직 Next.js 공식 타입만 사용 (NextResponse, NextRequest)
 * - 모든 설정값과 로직을 파일 내부에 직접 정의
 * 
 * 이렇게 해야 Edge Runtime에서 안전하게 실행됩니다.
 */

// ============================================
// Edge Runtime에서 직접 정의된 설정값들
// (lib/i18n/config.ts에서 복사해온 값들)
// ============================================
type Locale = 'ja' | 'en' | 'ko'
const SUPPORTED_LOCALES: Locale[] = ['ja', 'en', 'ko']
const DEFAULT_LOCALE: Locale = 'ja'

/**
 * 브라우저 언어를 Locale로 변환
 * (lib/i18n/config.ts의 getLocaleFromAcceptLanguage 함수 로직을 복사)
 */
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  
  const languages = acceptLanguage.toLowerCase().split(',')
  
  for (const lang of languages) {
    const code = lang.split(';')[0].trim()
    
    // 한국어
    if (code.startsWith('ko')) return 'ko'
    // 일본어
    if (code.startsWith('ja')) return 'ja'
    // 영어
    if (code.startsWith('en')) return 'en'
  }
  
  return DEFAULT_LOCALE
}

/**
 * locale이 유효한지 검증
 * (Edge Runtime에서 안전한 방식으로 직접 체크)
 */
function isValidLocale(locale: string): locale is Locale {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

/**
 * pathname에 locale prefix가 있는지 확인
 * (Edge Runtime 호환: some() 대신 명시적 체크)
 */
function hasLocalePrefix(pathname: string): boolean {
  // Edge Runtime에서 안전한 명시적 체크 방식 사용
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

  // 정적 파일, API 요청, 시스템 경로 등은 제외
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known') || // 시스템 경로 (Chrome DevTools 등)
    pathname.match(/\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next()
  }

  // 이미 언어 prefix가 있는지 확인
  if (hasLocalePrefix(pathname)) {
    return NextResponse.next()
  }

  // locale prefix가 없으면 브라우저 언어 감지 후 리다이렉트
  const acceptLanguage = req.headers.get('accept-language')
  const locale = getLocaleFromAcceptLanguage(acceptLanguage)

  // 안전한 리다이렉트: req.nextUrl.clone() 사용 및 중복 슬래시 방지
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  // 정적 파일 확장자 및 시스템 경로 제외
  matcher: [
    '/((?!api|_next|\\.well-known|.*\\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$).*)',
  ],
}
