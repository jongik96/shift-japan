'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    adsbygoogle: any[]
    adsbygooglePageLevelAdsInitialized?: boolean
  }
}

export default function AdSenseInit() {
  useEffect(() => {
    // 스크립트가 이미 로드되어 있을 수 있으므로 체크
    // 초기화 로직을 함수로 분리
    const initAdSense = () => {
      if (typeof window === 'undefined') return

      // 전역 플래그 확인
      if (window.adsbygooglePageLevelAdsInitialized) {
        return
      }

      // adsbygoogle 배열 확인 - 이미 enable_page_level_ads가 있는지 체크
      const adsbygoogle = window.adsbygoogle || []

      // adsbygoogle이 배열인 경우에만 .some() 체크 (이미 로드된 경우 객체일 수 있음)
      // 배열이 아니면 이미 초기화된 것으로 간주 (중복 초기화 시 TagError 발생 방지)
      const hasPageLevelAds = Array.isArray(adsbygoogle)
        ? adsbygoogle.some((config: any) => config && config.enable_page_level_ads === true)
        : true

      if (!hasPageLevelAds) {
        window.adsbygooglePageLevelAdsInitialized = true
        adsbygoogle.push({
          google_ad_client: 'ca-pub-8843011911940029',
          enable_page_level_ads: true,
        })

        // adsbygoogle이 없었던 경우에만 할당 (이미 객체로 로드된 경우 덮어쓰기 방지)
        if (!window.adsbygoogle) {
          window.adsbygoogle = adsbygoogle
        }
      }
    }

    // 스크립트가 이미 로드되어 있으면 즉시 초기화
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      initAdSense()
    }
  }, [])

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8843011911940029"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === 'undefined') return

        // 전역 플래그 확인
        if (window.adsbygooglePageLevelAdsInitialized) {
          return
        }

        const adsbygoogle = window.adsbygoogle || []

        // adsbygoogle이 배열인 경우에만 .some() 체크
        // 배열이 아니면 이미 초기화된 것으로 간주
        const hasPageLevelAds = Array.isArray(adsbygoogle)
          ? adsbygoogle.some((config: any) => config && config.enable_page_level_ads === true)
          : true

        if (!hasPageLevelAds) {
          window.adsbygooglePageLevelAdsInitialized = true
          adsbygoogle.push({
            google_ad_client: 'ca-pub-8843011911940029',
            enable_page_level_ads: true,
          })

          if (!window.adsbygoogle) {
            window.adsbygoogle = adsbygoogle
          }
        }
      }}
    />
  )
}
