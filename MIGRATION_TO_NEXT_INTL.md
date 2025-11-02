# @next-intl로 마이그레이션 제안

## 현재 상황

### ❌ 현재: 커스텀 i18n 구현
- 직접 구현한 다국어 시스템
- Edge Runtime 호환성 문제 발생
- `__dirname is not defined` 에러

### ✅ 해결책: @next-intl 사용

**@next-intl의 장점:**
- Next.js 14 App Router 공식 지원
- Edge Runtime 완벽 호환
- TypeScript 완전 지원
- 간단한 설정
- 자동 locale 감지 및 리다이렉션

## 마이그레이션 방법

### 옵션 1: @next-intl로 전환 (권장)
- 장점: 공식 라이브러리, Edge Runtime 완벽 호환
- 단점: 기존 코드 일부 수정 필요

### 옵션 2: 현재 구조 유지하며 수정
- 장점: 코드 변경 최소화
- 단점: 계속해서 Edge Runtime 문제 발생 가능

## 추천: @next-intl 사용

`@next-intl`은 Next.js 14 App Router를 위한 최신 i18n 라이브러리입니다.

**설치:**
```bash
npm install next-intl
```

**장점:**
1. Edge Runtime 완벽 호환
2. middleware 자동 제공
3. TypeScript 완전 지원
4. SEO 친화적
5. 서버/클라이언트 컴포넌트 모두 지원

어떤 방법을 원하시나요?
1. @next-intl로 마이그레이션
2. 현재 구조 유지하면서 수정

