// ============================================
// 1단계: 최소화된 middleware 테스트
// ============================================
// 이 코드는 어떤 로컬 파일도 import 하지 않습니다.
// 오직 Next.js 내장 모듈만 사용합니다.
// 이 부분에서 에러가 난다면 미들웨어 자체의 설정 문제입니다.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 아무것도 하지 않고 요청을 다음 단계로 통과시킵니다.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
