export type Locale = 'ja' | 'en' | 'ko'

export const locales: Locale[] = ['ja', 'en', 'ko']
export const defaultLocale: Locale = 'ja'

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

// 브라우저 언어를 Locale로 변환
export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  
  const languages = acceptLanguage.toLowerCase().split(',')
  
  for (const lang of languages) {
    const code = lang.split(';')[0].trim()
    
    // 한국어
    if (code.startsWith('ko')) return 'ko'
    // 일본어
    if (code.startsWith('ja')) return 'ja'
    // 영어
    if (code.startsWith('en')) return 'en'
  }
  
  return defaultLocale
}
