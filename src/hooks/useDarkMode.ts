import React from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'tax-smart-theme'

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readStoredTheme(): ThemeMode | null {
  if (!isBrowser()) return null
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function applyThemeToDom(theme: ThemeMode) {
  if (!isBrowser()) return
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.setAttribute('data-theme', theme)
  root.style.setProperty('color-scheme', theme)
}

export function useDarkMode(defaultMode: ThemeMode = 'dark') {
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    const initial = readStoredTheme() ?? defaultMode
    applyThemeToDom(initial)
    return initial
  })

  React.useEffect(() => {
    applyThemeToDom(theme)
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  React.useEffect(() => {
    if (!isBrowser()) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      setTheme((current) => readStoredTheme() ?? (event.matches ? 'dark' : 'light'))
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme((mode) => (mode === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme }
}
