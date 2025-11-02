'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Locale, isValidLocale } from './config'
import type { ComponentProps } from 'react'

type Dictionary = any

export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)

  useEffect(() => {
    const validLocale = isValidLocale(locale) ? locale : 'ja'
    
    // Dynamic import based on locale
    import(`@/public/locales/${validLocale}/common.json`)
      .then((module) => {
        setDictionary(module.default)
      })
      .catch((error) => {
        console.error('Failed to load dictionary:', error)
        // Fallback to default locale
        import('@/public/locales/ja/common.json')
          .then((module) => setDictionary(module.default))
      })
  }, [locale])

  const getValue = (key: string): any => {
    if (!dictionary) return key
    
    const keys = key.split('.')
    let value: any = dictionary
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value
  }

  const t = ((key: string): string => {
    const value = getValue(key)
    return typeof value === 'string' ? value : key
  }) as any

  // For accessing raw values (arrays, objects, etc.)
  t.raw = (key: string): any => {
    return getValue(key)
  }

  return t
}

export function useLocale(): Locale {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  return isValidLocale(locale) ? locale : 'ja'
}

