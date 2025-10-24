'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/react-query'

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Evita hydration mismatch mostrando um tema neutro
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        storageKey="equipe-ativa-theme"
        themes={['light', 'dark', 'system']}
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          duration={4000}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
