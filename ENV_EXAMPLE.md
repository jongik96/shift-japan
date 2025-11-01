# .env.local 파일 작성 예시

## 1️⃣ Supabase 프로젝트에서 값 가져오기

### Supabase 설정 화면에서:
1. [https://supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택 (또는 새 프로젝트 생성)
3. 왼쪽 메뉴에서 **Settings** → **API** 클릭
4. 다음 2개 값 복사:

---

## 2️⃣ .env.local 파일 내용

프로젝트 루트(`shift-japan` 폴더)에 `.env.local` 파일을 만들고 **다음 내용**을 입력하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTI5MTIzNCwiZXhwIjoxOTMwODY3MjM0fQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## 3️⃣ 실제 값 예시

**⚠️ 아래는 예시입니다. 반드시 본인의 Supabase 값으로 변경하세요!**

```env
# 예시: Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xzyvwutsrqpo.supabase.co

# 예시: Anon Key (이것은 정말 긴 문자열입니다)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eXZ3dXRzcXJwb1p3YXYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3ODkwMTIzNCwiZXhwIjoxOTk0NDU2NzIzNH0.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## 4️⃣ 파일 생성 방법

### Windows (Git Bash):
```bash
cd C:\Users\Park\Desktop\websites-for-Japanese\shift-japan
touch .env.local
```

### Windows (PowerShell):
```bash
cd C:\Users\Park\Desktop\websites-for-Japanese\shift-japan
New-Item -Path .env.local -ItemType File
```

### 또는 VS Code 사용:
1. VS Code에서 프로젝트 열기
2. 새 파일 생성 (`Ctrl+N`)
3. `.env.local` 저장 (`Ctrl+S`)
4. 위의 내용 붙여넣기
5. 본인의 실제 값으로 수정

---

## 5️⃣ 중요 사항

✅ **파일 위치**: 프로젝트 **최상위 폴더**에 있어야 함 (package.json과 같은 위치)

✅ **파일명 정확히**: `.env.local` (맨 앞에 점! 다른 이름 안 됨)

✅ **공백 없게**: `=` 앞뒤로 공백 없도록 작성

✅ **따옴표 불필요**: URL이나 Key 값을 따옴표로 감싸지 **말아야** 함

✅ **주석 가능**: `#` 으로 시작하는 줄은 주석

---

## 6️⃣ 파일 편집 후

서버 재시작 **필수**:
```bash
# 터미널에서 Ctrl+C 눌러서 서버 중지
npm run dev  # 다시 시작
```

---

## 7️⃣ 확인 방법

서버가 정상적으로 시작되면:
- http://localhost:3000 에서 사이트가 보이면 성공!
- 콘솔에 에러가 없으면 성공!

문제가 있으면 브라우저 콘솔(F12)에서 에러 메시지를 확인하세요.
