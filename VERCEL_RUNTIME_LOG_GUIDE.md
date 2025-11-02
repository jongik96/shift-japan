# Vercel Runtime Log 확인 가이드

## 🔍 Runtime Log에서 확인해야 할 항목

### 1. 기본 정보 확인
- **시간**: 에러가 발생한 정확한 시간
- **HTTP Method**: GET, POST 등
- **상태 코드**: 500, 404 등
- **경로**: 어떤 URL에서 에러가 발생했는지 (예: `/`, `/ja`, `/ja/report/...`)

### 2. 에러 메시지 전체 확인 ⭐ 가장 중요!
```
[ReferenceError: __dirname is not defined]
```
이것만 보면 안되고, 아래 정보도 함께 확인해야 합니다:

#### ✅ 확인해야 할 정보:
1. **전체 에러 스택 트레이스 (Stack Trace)**
   ```
   ReferenceError: __dirname is not defined
       at [파일명]:[라인번호]:[컬럼번호]
       at [호출한 함수명]
       at ...
   ```

2. **어떤 파일에서 발생했는지**
   - 예: `middleware.ts:15:5`
   - 예: `app/page.tsx:3:12`
   - 예: `lib/i18n/routing.ts:8:2`

3. **에러 발생 컨텍스트**
   - 어떤 함수/모듈에서 호출되었는지

### 3. 실제로 확인해야 하는 방법

#### Vercel 대시보드에서:
1. **Deployments 탭** → 최근 배포 클릭
2. **Functions 탭** 또는 **Runtime Logs** 탭 클릭
3. 에러가 발생한 로그 라인을 클릭하여 **상세 정보** 확인

#### 확인해야 할 항목:
- ✅ **Full Error Message** (전체 에러 메시지)
- ✅ **Stack Trace** (스택 트레이스)
- ✅ **Function Name** (어떤 함수에서 발생했는지)
- ✅ **File Path** (어떤 파일인지)
- ✅ **Line Number** (몇 번째 줄인지)

### 4. 공유해야 할 정보

다음 정보를 모두 스크린샷이나 복사해서 공유해주세요:

```
예시:
Nov 02 12:05:15.43
GET / 500
shift-japan-xxx.vercel.app

[전체 에러 메시지]
ReferenceError: __dirname is not defined
    at middleware (middleware.ts:15:5)    ← 이 부분이 중요!
    at handleRequest (next-server.js:123:45)
    ...
```

### 5. 로그에서 찾아야 할 핵심 정보

1. **어떤 파일?**
   - `middleware.ts`?
   - `app/page.tsx`?
   - `lib/i18n/routing.ts`?
   - 다른 파일?

2. **몇 번째 줄?**
   - 라인 넘버 확인

3. **어떤 코드?**
   - 해당 라인에 무엇이 있는지

### 6. 로그가 보이지 않는다면

1. **Filters 사용**:
   - Status: `Error` 또는 `500` 필터 적용
   - Function: `middleware` 필터 적용

2. **상세 로그 클릭**:
   - 각 로그 라인을 클릭하면 상세 정보가 보임
   - "Show more" 또는 "Expand" 버튼 클릭

3. **다른 탭 확인**:
   - Functions 탭
   - Build Logs 탭 (빌드는 성공했으니 여기는 문제없을 가능성 높음)
   - Runtime Logs 탭 (여기가 핵심!)

## 🚨 지금 바로 확인해주세요

Runtime Log에서 에러 라인을 클릭했을 때 나오는:
1. **전체 스택 트레이스**
2. **파일명과 라인 넘버**
3. **에러 발생 컨텍스트**

이 정보를 모두 공유해주시면 정확히 어디서 문제가 발생하는지 알 수 있습니다!

