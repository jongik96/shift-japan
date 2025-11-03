# Edge Runtime 디버깅 가이드

## 문제 진단

`__dirname is not defined` 에러가 발생하는 경우, 다음 순서로 진단하세요.

## 1. 원인 분리 실험

### middleware.ts 임시 비활성화

Vercel에서 middleware가 진짜 문제인지 확인:

```bash
# middleware.ts를 임시로 비활성화
mv middleware.ts middleware.disabled.ts
```

**결과 해석:**
- ✅ 에러가 사라지면 → middleware가 어떤 내부 의존성으로 Edge 런타임 문제 유발
- ❌ 에러가 그대로면 → middleware 외부(빌드 설정, next.config.js, favicon 처리 등) 문제

**복구:**
```bash
mv middleware.disabled.ts middleware.ts
```

## 2. Favicon 처리 확인

### 문제
Next.js가 `favicon.ico`를 찾지 못하면 내부적으로 `path.resolve(__dirname, ...)`를 시도할 수 있습니다.

### 해결 방법

1. **기존 이미지 활용 (권장)**
   - `app/layout.tsx`에 `icons` 메타데이터 추가 (완료됨)
   - 기존 `public/shiftjapan-favi.png` 사용

2. **favicon.ico 생성 (선택사항)**
   ```bash
   # 기존 이미지를 favicon.ico로 복사
   cp public/shiftjapan-favi.png public/favicon.ico
   ```

3. **middleware에서 favicon 제외 확인**
   - `middleware.ts`의 matcher에서 `/favicon.ico` 제외 확인 (완료됨)

## 3. next.config.js 점검

### 확인 사항

다음 항목이 있으면 Edge와 충돌할 수 있습니다:

- ❌ `const path = require('path')`
- ❌ `const __dirname = path.resolve()`
- ❌ `experimental.serverActions: true` (Edge runtime과 함께 사용 시)

### 현재 상태
✅ `next.config.js`는 Edge Runtime 안전 (위 항목 없음)

### 임시 조치 (테스트용)

문제 원인을 구분하기 위해 Node runtime으로 전환:

```js
const nextConfig = {
  experimental: {
    runtime: 'nodejs', // Edge 대신 Node runtime (테스트용)
  },
  // ... 기존 설정
}
```

**주의:** 이 설정은 테스트용으로만 사용하세요. 문제 원인 구분에 유용하지만, 프로덕션에서는 Edge runtime이 더 빠릅니다.

## 4. 빌드 캐시 삭제

로컬에서 빌드 캐시 문제가 의심될 때:

```bash
rm -rf .next
npm run build
```

## 5. Vercel 재배포

변경사항을 반영하려면:

1. Git에 커밋
2. Vercel 자동 배포 대기
3. 또는 Vercel 대시보드에서 "Redeploy" 실행

## 현재 프로젝트 상태

✅ **완료된 항목:**
- `middleware.ts`: Edge Runtime 완전 안전 (다른 파일 import 없음)
- `next.config.js`: Edge Runtime 안전 (path, __dirname 사용 없음)
- `app/layout.tsx`: favicon 메타데이터 추가 완료
- 모든 소스 코드: `__dirname`, `path`, `fs` 사용 없음

✅ **확인된 사항:**
- `next-i18next` 패키지 없음
- `_app.tsx`, `providers.tsx` 없음
- layout에서 i18n 라이브러리 직접 import 없음

## 예상 원인

현재 코드베이스가 Edge Runtime 안전하므로, 문제가 발생한다면:

1. **Next.js 빌드 산출물 문제**: Next.js가 내부적으로 favicon을 처리할 때 `__dirname` 사용
2. **Vercel 빌드 캐시**: 이전 빌드의 잘못된 코드가 캐시됨

## 6. Redirect 루프 및 URL 파싱 오류 진단

### 문제
`req.nextUrl.clone()` 사용해도 여전히 500이면, pathname이나 req.nextUrl이 예상과 다를 수 있습니다.

### 디버깅 로그

현재 `middleware.ts`에 디버깅 로그가 포함되어 있습니다:

```javascript
console.log('MIDDLEWARE PATHNAME:', pathname)
console.log('HAS_LOCALE:', hasLocale)
console.log('REDIRECT TO:', url.toString())
```

### 로그 확인 방법

1. **로컬 개발:**
   ```bash
   npm run dev
   # 터미널에서 로그 확인
   ```

2. **Vercel 배포:**
   - Vercel 대시보드 → Functions 탭 → Runtime Logs
   - 또는 Vercel CLI: `vercel logs`

### 로그 해석

#### ✅ 정상 동작
```
MIDDLEWARE PATHNAME: /
HAS_LOCALE: false
REDIRECT TO: https://example.com/ja
```

#### ❌ 무한 루프 (같은 URL 반복)
```
MIDDLEWARE PATHNAME: /ja
HAS_LOCALE: false
REDIRECT TO: https://example.com/ja
MIDDLEWARE PATHNAME: /ja
HAS_LOCALE: false
REDIRECT TO: https://example.com/ja
...
```
→ `hasLocale` 체크 로직 문제 가능성

#### ❌ 잘못된 URL (중복 슬래시)
```
MIDDLEWARE PATHNAME: //
REDIRECT TO: https://example.com//ja
```
→ `pathname === '/'` 체크 미작동

#### ❌ REDIRECT TO 직후 500 에러
→ `url.toString()` 단계에서 잘못된 URL 생성
→ `req.nextUrl.clone()` 사용 확인

## 7. config.matcher 구문 문제

### 문제
일부 Next.js 버전에서 괄호 그룹이 많을 때 Edge parser가 실패할 수 있습니다.

### 해결
matcher를 최대한 단순화:

```javascript
export const config = {
  matcher: [
    '/((?!api|_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$).*)',
  ],
}
```

### 테스트 순서
1. favicon 조건 제거 (완료됨)
2. 빌드 테스트
3. 문제 지속 시 확장자 목록 축소

## 해결 순서

1. ✅ `app/layout.tsx`에 favicon 메타데이터 추가 (완료)
2. ✅ 디버깅 로그 추가 (완료)
3. ✅ matcher 정규식 단순화 (완료)
4. → Vercel 재배포
5. → Vercel 로그에서 디버깅 출력 확인
6. → 문제 지속 시 middleware 임시 비활성화로 원인 분리
7. → 필요 시 `next.config.js`에 `experimental.runtime: 'nodejs'` 임시 추가 (테스트용)

