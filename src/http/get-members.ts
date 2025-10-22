import type { Role } from '@/lib/auth/'
import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    orgRole: Role
    unitRole: Role
    name: string | null
    avatarUrl: string | null
    email: string
    isOnline: boolean
    lastSeen: string | null
  }[]
}

interface GetMembersRequest {
  organizationSlug: string
  unitSlug: string
}

export async function getMembers({
  organizationSlug,
  unitSlug,
}: GetMembersRequest): Promise<GetMembersResponse> {
  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for members')
    const response = await fetch(`/api/organizations/${organizationSlug}/units/${unitSlug}/members`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao buscar membros')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  const result = await api
    .get(`organizations/${organizationSlug}/units/${unitSlug}/members`)
    .json<GetMembersResponse>()

  return result
}
