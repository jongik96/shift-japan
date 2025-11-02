import { Locale } from './config'

const dictionaries: Record<Locale, () => Promise<any>> = {
  ja: () => import('@/public/locales/ja/common.json').then((module) => module.default),
  en: () => import('@/public/locales/en/common.json').then((module) => module.default),
  ko: () => import('@/public/locales/ko/common.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}

