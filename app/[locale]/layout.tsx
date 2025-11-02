import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n/config'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params?.locale || 'ja'

  if (!isValidLocale(locale)) {
    notFound()
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>
}

