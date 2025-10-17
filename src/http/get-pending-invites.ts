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

export async function getPendingInvites(): Promise<GetPendingInvitesResponse> {
  // Esta função só deve ser usada no client-side
  // Para server components, use getPendingInvitesServer()
  const response = await fetch(`/api/invite/pending`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  return result
}
