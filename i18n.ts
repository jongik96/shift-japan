import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['ja', 'en', 'ko'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ja'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound()
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})

