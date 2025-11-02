import { notFound } from 'next/navigation'
import { locales, isValidLocale } from '@/lib/i18n/config'

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
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

