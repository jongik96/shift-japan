import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 정적 파일 확장자 체크
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png'
  ) {
    return NextResponse.next()
  }

  // 루트 경로는 /ja로 리다이렉트
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ja', request.url), 307)
  }

  // locale prefix가 있으면 통과
  if (pathname.startsWith('/ja') || pathname.startsWith('/en') || pathname.startsWith('/ko')) {
    return NextResponse.next()
  }

  // locale prefix가 없으면 /ja로 리다이렉트
  return NextResponse.redirect(new URL(`/ja${pathname}`, request.url), 307)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|.*\\..*).*)',
  ],
}
