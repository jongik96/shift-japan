# Vercel에서 Stack Trace 찾는 방법

## 🔍 지금 보여주신 정보는 기본 정보입니다

현재 보여주신 것:
- ✅ GET / 500
- ✅ Middleware에서 발생
- ❌ **하지만 구체적인 에러 메시지(Stack Trace)가 없음**

## 📋 필요한 정보 찾는 방법

### 방법 1: 로그 확장하기
1. Vercel 대시보드 → **Deployments** 탭
2. 최근 배포 클릭
3. **Functions** 탭 또는 **Runtime Logs** 탭
4. 에러가 발생한 로그 라인을 **클릭**
5. **"Show more"**, **"Expand"**, **"Details"** 버튼 찾기
6. 클릭하면 **전체 Stack Trace**가 보임

### 방법 2: Functions 탭에서 확인
1. **Functions** 탭 클릭
2. `middleware` 함수 찾기
3. 클릭하여 상세 정보 확인
4. **"View Logs"** 또는 **"Error Details"** 클릭

### 방법 3: 직접 확인하기
로그에서 이런 부분을 찾아주세요:

```
ReferenceError: __dirname is not defined
    at [어떤 파일]:[라인 번호]
    at [어떤 함수]
```

예시:
```
ReferenceError: __dirname is not defined
    at middleware (middleware.ts:15:5)
    at handleRequest (...)
```

## 🚨 만약 Stack Trace가 보이지 않는다면

다른 방법으로 문제를 해결하겠습니다.
1. middleware를 임시로 완전히 비활성화
2. 다른 방법으로 locale 리다이렉션 구현

이 방법으로 문제가 해결되는지 확인할 수 있습니다.

