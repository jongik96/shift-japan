import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ⚠️ Edge Runtime 이슈를 피하기 위해 명시적으로 Node.js 런타임 사용
export const config = {
  // Edge 런타임 대신 Node.js 런타임을 사용 (콜드 스타트 증가 가능성 유의)
  runtime: 'nodejs',
  // 모든 경로를 매칭하여 로케일 처리를 중앙 집중화
  matcher: ['/:path*'],
}

const defaultLocale = 'ja'
const locales = ['ja', 'en', 'ko']

function getLocaleFromPath(pathname: string): string | null {
  // 경로의 첫 번째 세그먼트가 로케일인지 확인
  const segments = pathname.split('/')
  if (segments.length > 1 && locales.includes(segments[1])) {
    return segments[1]
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = getLocaleFromPath(pathname)

  // 1. 유효하지 않은 로케일이거나, 로케일이 없는 루트 경로 접근 시 기본 로케일로 리다이렉트
  if (locale === null && pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // 2. 경로가 로케일이 아니지만, 리다이렉트가 필요한 경로일 경우 처리
  // 예: /about -> /ja/about 으로 리다이렉트
  if (locale === null && pathname !== '/') {
    // _next, api, 정적 파일 등을 제외한 나머지 경로
    if (
      !pathname.includes('/_next') &&
      !pathname.includes('/api') &&
      !pathname.match(/\.(ico|png|svg|xml|txt|jpg|jpeg|gif|webp|css|js)$/)
    ) {
      return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
    }
  }

  // 3. 유효한 로케일이 있는 경우 그대로 통과 (app/[locale]/layout.tsx에서 최종 검증)

  return NextResponse.next()
}

