import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge Runtime 안전한 middleware
 * 
 * 중요: 이 파일은 절대 다른 파일을 import하지 않습니다.
 * - lib/i18n/* 파일들을 import하지 않음
 * - Node.js API (fs, path, __dirname) 사용하지 않음
 * - 오직 Next.js 공식 타입만 사용 (NextResponse, NextRequest)
 * 
 * 이렇게 해야 Edge Runtime에서 안전하게 실행됩니다.
 */

// Edge Runtime에서 직접 정의 - 다른 파일 import 금지
const SUPPORTED_LOCALES = ['ja', 'en', 'ko']
const DEFAULT_LOCALE = 'ja'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 디버깅: pathname 확인
  console.log('MIDDLEWARE PATHNAME:', pathname)

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
  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  console.log('HAS_LOCALE:', hasLocale)

  if (!hasLocale) {
    // 브라우저 언어 감지
    const lang =
      req.headers.get('accept-language')?.split(',')[0].split('-')[0] || DEFAULT_LOCALE

    const locale = SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LOCALE

    // 안전한 리다이렉트: req.nextUrl.clone() 사용 및 중복 슬래시 방지
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

    console.log('REDIRECT TO:', url.toString())

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // 정적 파일 확장자 및 시스템 경로 제외
  matcher: [
    '/((?!api|_next|\\.well-known|.*\\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$).*)',
  ],
}
