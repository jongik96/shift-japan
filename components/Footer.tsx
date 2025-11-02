'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { type Locale } from '@/lib/i18n/config'

export default function Footer() {
  const params = useParams()
  const locale = (params?.locale as string || 'ja') as Locale
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale).then(setDictionary)
  }, [locale])

  if (!dictionary) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">🇯🇵 Shift Japan Insight</h3>
            <p className="text-gray-300 mb-4">{dictionary.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{dictionary.footer.links}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-white transition">
                  {dictionary.nav.blog}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-300 hover:text-white transition">
                  {dictionary.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition">
                  {dictionary.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{dictionary.footer.other}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white transition">
                  {dictionary.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white transition">
                  {dictionary.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Shift Japan Insight. {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
