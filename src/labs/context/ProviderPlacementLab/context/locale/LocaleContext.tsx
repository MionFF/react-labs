import { createContext, useContext } from 'react'
import type { Locale } from '../../types'

type LocaleContextProps = {
  locale: Locale
  toggleLocale: () => void
}

export const LocaleContext = createContext<LocaleContextProps | null>(null)

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('LocaleProvider is required!')
  return value
}
