// This file is used by Client Components only
// Server Components should define constants directly to avoid Edge Runtime issues

export type Locale = 'ja' | 'en' | 'ko'

// Use direct array initialization to avoid potential Edge Runtime issues
export const locales = ['ja', 'en', 'ko'] as const satisfies readonly Locale[]
export const defaultLocale: Locale = 'ja'

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

