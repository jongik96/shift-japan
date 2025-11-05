// ============================================
// 1단계: 최소화된 middleware 테스트
// ============================================
// 이 코드는 어떤 로컬 파일도 import 하지 않습니다.
// 오직 Next.js 내장 모듈만 사용합니다.
// 이 부분에서 에러가 난다면 미들웨어 자체의 설정 문제입니다.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일 확장자 체크 - Edge Runtime 안전한 방식
  const staticExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml', '.txt']
  const hasStaticExtension = staticExtensions.some(ext => pathname.endsWith(ext))
  
  // 정적 파일, API, Next.js 내부 경로는 즉시 통과
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known') ||
    hasStaticExtension ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname.includes('/shiftjapan-favi') ||
    pathname.includes('/shiftjapan-og')
  ) {
    return NextResponse.next()
  }

  // 루트 경로는 app/page.tsx에서 처리하므로 통과
  if (pathname === '/') {
    return NextResponse.next()
  }

  // 이미 locale prefix가 있으면 통과
  if (
    pathname === '/ja' ||
    pathname === '/en' ||
    pathname === '/ko' ||
    pathname.startsWith('/ja/') ||
    pathname.startsWith('/en/') ||
    pathname.startsWith('/ko/')
  ) {
    return NextResponse.next()
  }

  // locale prefix가 없는 경로는 /ja로 리다이렉트
  const url = request.nextUrl.clone()
  url.pathname = `/ja${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // 정적 파일과 루트 경로를 matcher 단계에서 완전히 제외
  // 루트 경로(/)는 app/page.tsx에서 처리
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon files
     * - root path (/)
     * - files with extensions (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|^/$|.*\\..*).*)',
  ],
}
