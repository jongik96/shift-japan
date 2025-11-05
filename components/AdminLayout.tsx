'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import 'easymde/dist/easymde.min.css'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLocalhost, setIsLocalhost] = useState(false)

  useEffect(() => {
    // Check if running on localhost
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    setIsLocalhost(isLocal)

    if (!isLocal) {
      // Not localhost - redirect to home
      router.push('/')
      return
    }

    // Localhost - check auth
    // 관리자 페이지는 항상 /ko로 접근
    const auth = localStorage.getItem('admin_authenticated')
    const currentLocale = pathname?.split('/')[1]
    
    // /ko가 아니면 /ko/admin으로 리다이렉트
    if (currentLocale && currentLocale !== 'ko') {
      const newPath = pathname.replace(`/${currentLocale}/admin`, '/ko/admin')
      router.push(newPath)
      return
    }
    
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else if (pathname && !pathname.includes('/admin/login')) {
      router.push('/ko/admin/login')
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    router.push('/ko/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isLocalhost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 제한</h1>
          <p className="text-gray-600">관리자 페이지는 로컬 환경에서만 사용 가능합니다</p>
        </div>
      </div>
    )
  }

  if (pathname && pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <>
                <Link href="/ko/admin" className="flex items-center px-3 py-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                  <span className="text-2xl mr-2">🔐</span>
                  관리자 패널
                </Link>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                  <Link
                    href="/ko/admin"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/ko/admin'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    📝 글 목록
                  </Link>
                  <Link
                    href="/ko/admin/new"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/ko/admin/new'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    ✏️ 새 글 작성
                  </Link>
                </div>
              </>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/ja"
                target="_blank"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition flex items-center gap-1"
              >
                <span>🌐</span>
                <span className="hidden sm:inline">사이트 보기</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center gap-2"
              >
                <span>🚪</span>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
