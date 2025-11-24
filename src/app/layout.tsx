import type { Metadata } from 'next'
import './globals.css'
import WhatsappButton from '@/components/whatsapp-button'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
// import { ThemeProvider } from 'next-themes'
import { Providers } from './provider'

export const metadata: Metadata = {
  title: 'Equipe Ativa',
  description: 'EA, do início ao fim.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
      </head>
      <body 
        suppressHydrationWarning 
        className="min-h-screen medical-layout antialiased overflow-x-hidden"
      >
        <Providers>
          <div className="min-h-screen flex flex-col relative">
            {/* Background Pattern - apenas visível no dark mode */}
            <div className="fixed inset-0 -z-10 dark:opacity-40 opacity-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background"></div>
            </div>
            
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 relative">
              <div className="space-y-4 backdrop-blur-[0.5px]">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <WhatsappButton />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
