import { I18nProvider } from '@/lib/i18n/context'
import { redirect } from 'next/navigation'

// Define types and functions directly to avoid Edge Runtime issues
type Locale = 'ja' | 'en' | 'ko'

const locales = ['ja', 'en', 'ko'] as const
const defaultLocale = 'ja'

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale

  // Validate locale
  if (!isValidLocale(locale)) {
    redirect(`/${defaultLocale}`)
  }

  return (
    <I18nProvider locale={locale as Locale}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </I18nProvider>
  )
}

