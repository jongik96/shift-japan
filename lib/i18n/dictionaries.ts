/**
 * 번역 파일 로딩 모듈
 * 
 * 중요: Edge Runtime 호환 방식으로 구현되었습니다.
 * - Node.js API (__dirname, fs, path) 사용하지 않음
 * - 정적 import를 사용하여 Next.js 빌드 시 번역 파일을 번들에 포함
 * - 동적 import로 런타임에 필요한 번역만 로드
 * - 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 안전하게 사용 가능
 */

import { type Locale } from './config'

// 언어별 JSON 파일을 직접 정적 import
// ⚠️ 중요: public 폴더는 정적 파일 서빙용이므로 import하면 안 됩니다.
// 대신 프로젝트 루트의 locales 폴더를 사용합니다.
// 상대 경로를 사용하여 빌드 시 경로 해석 문제를 방지합니다.
// Next.js가 빌드 시 이 파일들을 적절하게 처리하고,
// __dirname이나 fs 모듈에 의존하지 않게 됩니다.
const dictionaries = {
  ja: () => import('../../locales/ja/common.json').then((module) => module.default),
  en: () => import('../../locales/en/common.json').then((module) => module.default),
  ko: () => import('../../locales/ko/common.json').then((module) => module.default),
}

// Dictionary 타입 정의 (타입 안정성 향상)
export type Dictionary = Awaited<ReturnType<typeof dictionaries['ja']>>

/**
 * 서버 컴포넌트에서 비동기적으로 번역 데이터를 가져옵니다.
 * 
 * @param locale - 가져올 언어 코드 (ja, en, ko)
 * @returns Promise<Dictionary> - 번역 데이터 객체
 * 
 * @example
 * ```tsx
 * // app/[locale]/page.tsx
 * const dictionary = await getDictionary(locale)
 * return <h1>{dictionary.home.title}</h1>
 * ```
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // 유효하지 않은 locale 처리 (실제로는 layout에서 isValidLocale로 이미 검증됨)
  if (!dictionaries[locale]) {
    // 기본 언어(ja)로 폴백
    return dictionaries.ja() as Promise<Dictionary>
  }

  return dictionaries[locale]()
}
