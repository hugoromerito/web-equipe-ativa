import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TV Display - Equipe Ativa',
  description: 'Sistema de chamada de pacientes',
}

export default function TVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
