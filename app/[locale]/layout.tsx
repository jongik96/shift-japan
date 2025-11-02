import { I18nProvider } from '@/lib/i18n/context'
import { Locale, defaultLocale, isValidLocale } from '@/lib/i18n/routing'
import { redirect } from 'next/navigation'

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

