import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Locale } from '../../types'
import { LocaleContext } from './LocaleContext'

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale')
    if (stored === 'en' || stored === 'es') return stored
    return 'en'
  })

  const toggleLocale = useCallback(() => {
    setLocale(l => (l === 'es' ? 'en' : 'es'))
  }, [])

  useEffect(() => {
    localStorage.setItem('locale', locale)
  }, [locale])

  const value = useMemo(() => ({ locale, toggleLocale }), [locale, toggleLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
