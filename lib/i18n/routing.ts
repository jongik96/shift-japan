// Simple routing utilities - Edge Runtime compatible
// This file MUST NOT use any Node.js APIs or cause Edge Runtime issues

export type Locale = 'ja' | 'en' | 'ko'

// Define as const to avoid any potential issues
export const locales: readonly Locale[] = ['ja', 'en', 'ko'] as const
export const defaultLocale: Locale = 'ja'

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

