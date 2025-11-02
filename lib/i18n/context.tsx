'use client'

import React, { createContext, useContext } from 'react'
import { Locale, translations } from './translations'

interface I18nContextType {
  locale: Locale
  t: typeof translations.ja
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode
  locale: Locale
}) {
  return (
    <I18nContext.Provider value={{ locale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
