import { createContext, useContext } from 'react'
import type { Theme } from '../../types'

type ThemeContextProps = {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('ThemeProvider is required!')
  return value
}
