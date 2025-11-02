'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { Locale, isValidLocale } from './config'

// 클라이언트에서 번역 데이터를 사용하는 훅
export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const validLocale = isValidLocale(locale) ? locale : 'ja'

  // 번역 데이터는 서버에서만 로드되므로, 클라이언트에서는 간단한 타입만 반환
  // 실제 번역은 서버 컴포넌트에서 처리
  return useMemo(() => {
    return {
      locale: validLocale,
    }
  }, [validLocale])
}

export function useLocale(): Locale {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  return isValidLocale(locale) ? locale : 'ja'
}
