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

  // 정적 파일, API, favicon 등은 제외
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/favicon.png') ||
    pathname.startsWith('/shiftjapan-') || // favicon, og 이미지 등
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i) // 모든 정적 파일 확장자
  ) {
    return NextResponse.next()
  }

  // 이미 언어 prefix가 있으면 그대로 통과
  const pathnameIsMissingLocale = SUPPORTED_LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    // 브라우저 언어 감지
    const lang =
      req.headers.get('accept-language')?.split(',')[0].split('-')[0] || DEFAULT_LOCALE

    const locale = SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LOCALE

    // 리다이렉트
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  // 정적 파일 확장자 제외 (non-capturing group 사용)
  matcher: [
    '/((?!_next|api|favicon|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)).*)',
  ],
}
