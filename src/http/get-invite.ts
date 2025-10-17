
import type { Role } from '@/lib/auth/'

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    createdAt: string
    unit: {
      name: string
      organization: {
        name: string
      }
    } | null
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }
}

export async function getInvite(inviteId: string) {
  // Como o backend não tem rota /invites/{id}, vamos buscar na lista de convites pendentes
  const response = await fetch(`/api/invite/pending`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  
  // Procurar o convite específico na lista
  const foundInvite = result.invites?.find((inv: any) => inv.id === inviteId)
  
  if (!foundInvite) {
    throw new Error('Convite não encontrado')
  }

  return { invite: foundInvite } as GetInviteResponse
}
