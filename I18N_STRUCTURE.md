# 현재 다국어(i18n) 구조 설명

## 📁 파일 구조

### 1. 라우팅 레이어 (URL 기반 다국어)

#### `middleware.ts` (Edge Runtime)
- **역할**: URL에서 locale을 감지하고 리다이렉션
- **동작**: 
  - `/` → `/ja`로 리다이렉트
  - `/ja`, `/en`, `/ko` 접두사가 없으면 `/ja`로 리다이렉트
- **문제점**: Edge Runtime에서 `__dirname` 에러 발생 가능

#### `app/page.tsx` (Server Component)
- **역할**: 루트 경로 `/` 접속 시 `/ja`로 리다이렉트
- **동작**: `redirect('/ja')` 실행
- **문제점**: middleware와 중복 로직

### 2. 레이아웃 레이어

#### `app/layout.tsx` (Root Layout)
- 기본 HTML 구조 제공
- 언어는 항상 "ja"로 고정

#### `app/[locale]/layout.tsx` (Locale Layout)
- **역할**: locale 검증 및 I18nProvider 제공
- **동작**:
  - params에서 locale 추출
  - locale 검증 (ja, en, ko만 허용)
  - I18nProvider로 감싸서 translations 제공
- **문제점**: `locales.includes()` 사용 → Edge Runtime 문제 가능성

### 3. 번역 레이어

#### `lib/i18n/routing.ts`
- **역할**: Locale 타입 및 유틸리티 함수 제공
- **내용**:
  - `Locale` 타입: 'ja' | 'en' | 'ko'
  - `locales` 배열
  - `defaultLocale`
  - `isValidLocale()` 함수
  - `getTableName()` 함수 (Supabase 테이블명 생성)
- **문제점**: Server Component에서 import 시 Edge Runtime 에러 가능

#### `lib/i18n/translations.ts`
- **역할**: 실제 번역 문자열 제공
- **구조**: `{ ja: {...}, en: {...}, ko: {...} }`
- **문제점**: `Locale` 타입을 직접 정의 (routing.ts와 중복)

#### `lib/i18n/context.tsx` (Client Component)
- **역할**: React Context로 translations 제공
- **동작**:
  - `I18nProvider`: locale에 맞는 translations 제공
  - `useI18n()`: Client Component에서 translations 사용
- **사용처**: Header, Footer, 페이지 컴포넌트

## 🔄 데이터 흐름

### 1. 사용자가 `/` 접속 시:
```
1. middleware.ts → `/ja`로 리다이렉트
2. app/page.tsx → `/ja`로 리다이렉트 (중복)
3. app/[locale]/layout.tsx → locale='ja' 검증
4. I18nProvider → translations.ja 제공
5. app/[locale]/page.tsx → 번역된 내용 표시
```

### 2. 사용자가 `/ja/about` 접속 시:
```
1. middleware.ts → locale 확인 후 통과
2. app/[locale]/layout.tsx → locale='ja' 검증
3. I18nProvider → translations.ja 제공
4. app/[locale]/about/page.tsx → 번역된 내용 표시
```

## ⚠️ 문제점 분석

### 문제 1: 중복 로직
- `middleware.ts`와 `app/page.tsx` 둘 다 리다이렉트 처리
- 불필요한 중복

### 문제 2: Edge Runtime 호환성
- middleware는 Edge Runtime에서 실행
- `locales.includes()` 같은 배열 메서드가 문제 가능
- `lib/i18n/routing.ts` import 시 `__dirname` 에러 발생

### 문제 3: 타입 중복
- `lib/i18n/routing.ts`에서 `Locale` 타입 정의
- `lib/i18n/translations.ts`에서도 `Locale` 타입 정의
- 불필요한 중복

## 🔧 해결 방안

1. **middleware 단순화**: 배열 메서드 제거, 직접 if문 사용
2. **타입 통합**: translations.ts에서 routing.ts의 타입 사용
3. **리다이렉트 로직 통합**: middleware만 사용하거나 app/page.tsx만 사용

