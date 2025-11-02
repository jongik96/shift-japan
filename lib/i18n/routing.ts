// Simple routing utilities for getting table names based on locale
// Re-export Locale type from i18n.ts for convenience
import { type Locale } from '@/i18n'

export type { Locale }

export function getTableName(locale: Locale): string {
  return `blog_${locale}`
}

