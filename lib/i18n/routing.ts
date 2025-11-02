export type Locale = 'ja' | 'en' | 'ko'

export const locales: Locale[] = ['ja', 'en', 'ko']
export const defaultLocale: Locale = 'ja'

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

