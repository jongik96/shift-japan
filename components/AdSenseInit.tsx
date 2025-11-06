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
    const initAdSense = () => {
      if (typeof window === 'undefined') return

      // 전역 플래그 확인
      if (window.adsbygooglePageLevelAdsInitialized) {
        return
      }

      // adsbygoogle 배열 확인 - 이미 enable_page_level_ads가 있는지 체크
      const adsbygoogle = window.adsbygoogle || []
      const hasPageLevelAds = adsbygoogle.some(
        (config: any) => config && config.enable_page_level_ads === true
      )

      if (!hasPageLevelAds) {
        window.adsbygooglePageLevelAdsInitialized = true
        adsbygoogle.push({
          google_ad_client: 'ca-pub-8843011911940029',
          enable_page_level_ads: true,
        })
        window.adsbygoogle = adsbygoogle
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

        // adsbygoogle 배열 확인 - 이미 enable_page_level_ads가 있는지 체크
        const adsbygoogle = window.adsbygoogle || []
        const hasPageLevelAds = adsbygoogle.some(
          (config: any) => config && config.enable_page_level_ads === true
        )

        if (!hasPageLevelAds) {
          window.adsbygooglePageLevelAdsInitialized = true
          adsbygoogle.push({
            google_ad_client: 'ca-pub-8843011911940029',
            enable_page_level_ads: true,
          })
          window.adsbygoogle = adsbygoogle
        }
      }}
    />
  )
}

