export type Locale = 'ja' | 'en' | 'ko'

export const locales: Locale[] = ['ja', 'en', 'ko']
export const defaultLocale: Locale = 'ja'

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

