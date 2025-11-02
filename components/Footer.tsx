'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const params = useParams()

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">🇯🇵 Shift Japan Insight</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-white transition">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-300 hover:text-white transition">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t('footer.other')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white transition">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white transition">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Shift Japan Insight. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
