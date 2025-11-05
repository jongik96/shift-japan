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

  // 나머지만 middleware 처리
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
}
