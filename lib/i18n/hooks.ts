'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Locale, isValidLocale } from './config'

// Static imports for all locales - ensures build-time bundling
import jaDict from '@/public/locales/ja/common.json'
import enDict from '@/public/locales/en/common.json'
import koDict from '@/public/locales/ko/common.json'

type Dictionary = any

const dictionaries: Record<Locale, any> = {
  ja: jaDict,
  en: enDict,
  ko: koDict,
}

export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const validLocale = isValidLocale(locale) ? locale : 'ja'
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)

  useEffect(() => {
    // Use static dictionary lookup
    setDictionary(dictionaries[validLocale] || dictionaries.ja)
  }, [validLocale])

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

