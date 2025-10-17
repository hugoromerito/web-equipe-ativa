import { cookies } from 'next/headers'
import type { Role } from '@/lib/auth/'

interface GetPendingInvitesResponse {
  invites: {
    id: string
    createdAt: string
    role: Role
    email: string
    unit: {
      name: string
      organization: {
        name: string
      }
    } | null
    author: {
      name: string | null
      id: string
      avatarUrl: string | null
    } | null
  }[]
}

export async function getPendingInvitesServer(): Promise<GetPendingInvitesResponse> {
  // Esta função só pode ser chamada em Server Components
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) {
    throw new Error('Token não encontrado')
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const response = await fetch(`${apiUrl}/invites/pending`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  return result
}