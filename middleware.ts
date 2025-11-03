import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['ja', 'en', 'ko']
const DEFAULT_LOCALE = 'ja'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 정적 파일, API, favicon 등은 제외
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
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
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
