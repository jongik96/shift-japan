import { redirect } from 'next/navigation'

// 서버 컴포넌트에서 리다이렉트 (Edge Runtime 안전)
export default function RootPage() {
  redirect('/ja')
}

