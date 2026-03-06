import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'
import type { Theme } from '../../types'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' ? 'dark' : 'light'
  })
  const [tick, setTick] = useState(0)

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <button
        className='p-1 border rounded cursor-pointer'
        onClick={() => setTick(prev => prev + 1)}
      >
        Tick {tick}
      </button>
    </ThemeContext.Provider>
  )
}
