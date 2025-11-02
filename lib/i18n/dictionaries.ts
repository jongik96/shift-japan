import { type Locale } from './config'

// 번역 파일을 동적으로 import
const dictionaries = {
  ja: () => import('@/public/locales/ja/common.json').then((module) => module.default),
  en: () => import('@/public/locales/en/common.json').then((module) => module.default),
  ko: () => import('@/public/locales/ko/common.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
