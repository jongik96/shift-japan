import { notFound } from 'next/navigation'

// Edge Runtime compatible validation - defined directly
function isValidLocale(locale: string): boolean {
  return locale === 'ja' || locale === 'en' || locale === 'ko'
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params?.locale || 'ja'

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

