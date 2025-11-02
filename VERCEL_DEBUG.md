# Vercel 에러 디버깅 가이드

## 로그 확인 방법

### 1. Deployments 탭에서 로그 확인 (가장 중요!)
1. Vercel 대시보드 → 프로젝트 선택
2. 상단 메뉴의 **"Deployments"** 클릭
3. 가장 최근 배포 클릭
4. 아래 중 하나를 확인:
   - **"Runtime Logs"** - 런타임 에러 확인
   - **"Build Logs"** - 빌드 에러 확인
   - **"Function Logs"** - 서버리스 함수 에러 확인

### 2. 왼쪽 메뉴의 Logs 탭
- Vercel 대시보드 왼쪽 메뉴에 **"Logs"** 탭이 있을 수 있습니다
- 실시간 로그를 확인할 수 있습니다

### 3. 상세 에러 정보
- 각 배포를 클릭하면 상세 정보가 표시됩니다
- 에러 메시지와 스택 트레이스를 확인할 수 있습니다

## Middleware 에러 해결 방법

### 문제가 지속되는 경우:

#### 방법 1: Middleware 임시 비활성화
`middleware.ts` 파일을 임시로 이름 변경:
```bash
mv middleware.ts middleware.ts.backup
```

#### 방법 2: 단순화된 Middleware
더 간단한 버전으로 교체하여 테스트

#### 방법 3: 로컬에서 Vercel 환경 시뮬레이션
```bash
npm install -g vercel
vercel dev
```

## 확인해야 할 사항

1. **환경 변수 설정 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인

2. **빌드 로그 확인**
   - 배포 시 빌드가 성공했는지 확인
   - TypeScript 에러나 빌드 에러가 없는지 확인

3. **Runtime 에러 확인**
   - Runtime Logs에서 실제 에러 메시지 확인
   - 에러 발생 시점과 요청 정보 확인

## 참고
- Middleware는 Edge Runtime에서 실행되므로, 일부 Node.js API를 사용할 수 없습니다
- 모든 import가 Edge Runtime에서 지원되는지 확인해야 합니다

