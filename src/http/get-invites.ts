export interface Invite {
  id: string
  email: string
  role: string
  createdAt: string
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
  unit: {
    name: string
    organization: {
      name: string
    }
  } | null
}

interface GetInvitesResponse {
  invites: Invite[]
}

export async function getInvites() {
  // Esta função é um alias para getPendingInvites - usar para compatibilidade
  const response = await fetch(`/api/invite/pending`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  return result as GetInvitesResponse
}
