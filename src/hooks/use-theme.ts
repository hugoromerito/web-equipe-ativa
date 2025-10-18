'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Retorna valores seguros antes da hidratação
  if (!mounted) {
    return {
      theme: 'light',
      setTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      isDark: false,
      isLight: true,
      isSystem: false,
      mounted: false,
    }
  }

  const isDark = resolvedTheme === 'dark'
  const isLight = resolvedTheme === 'light'
  const isSystem = theme === 'system'

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    isDark,
    isLight,
    isSystem,
    mounted,
  }
}

// Hook para detecção de preferência do sistema
export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }
    
    updateSystemTheme()
    
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  return systemTheme
}

// Hook para transições suaves de tema
export function useThemeTransition() {
  const { setTheme, theme, mounted } = useTheme()

  const setThemeWithTransition = (newTheme: string) => {
    if (!mounted) return

    // Adiciona classe de transição
    document.documentElement.classList.add('theme-transitioning')
    
    // Muda o tema
    setTheme(newTheme)
    
    // Remove a classe após a transição
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 300)
  }

  return {
    theme,
    setTheme: setThemeWithTransition,
    mounted,
  }
}