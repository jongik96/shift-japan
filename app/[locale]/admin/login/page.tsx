'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 간단한 비밀번호 체크 (실제로는 더 안전한 인증을 사용해야 함)
    // 로컬 개발용이므로 간단하게 처리
    if (password === 'admin' || password === '1234') {
      localStorage.setItem('admin_authenticated', 'true')
      // 관리자 페이지는 항상 /ko로 접근
      router.push('/ko/admin')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 로그인</h1>
          <p className="text-gray-600">로컬 개발 환경 전용</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="비밀번호를 입력하세요"
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              기본 비밀번호: <code className="bg-gray-100 px-2 py-1 rounded">admin</code> 또는 <code className="bg-gray-100 px-2 py-1 rounded">1234</code>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⚠️ 이 페이지는 localhost에서만 접근 가능합니다</p>
        </div>
      </div>
    </div>
  )
}

