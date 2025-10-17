import type { Metadata } from 'next'
import './globals.css'
import WhatsappButton from '@/components/whatsapp-button'
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
      </head>
      <body suppressHydrationWarning className="min-h-screen medical-layout">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-6">
                {children}
              </div>
            </main>
          </div>
          <WhatsappButton />
        </Providers>
      </body>
    </html>
  )
}
