import { api } from './api-client'

export interface GetMembersOrganizationRequest {
  organizationSlug: string
  page?: number
  pageSize?: number
}

export interface Member {
  id: string
  organization_role: string
  user: {
    id: string
    name: string | null
    email: string
    avatar_url: string | null
    last_seen: string | null
  }
  is_online: boolean
}

interface GetMembersOrganizationResponse {
  members: Member[]
  totalCount: number
}

export async function getMembersOrganization({
  organizationSlug,
  page = 1,
  pageSize = 10,
}: GetMembersOrganizationRequest) {
  console.log('🔍 [getMembersOrganization] Chamando API:', {
    url: `organizations/${organizationSlug}/members`,
    page,
    pageSize,
  })

  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for organization members')
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })
    const response = await fetch(`/api/organizations/${organizationSlug}/members?${params}`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao buscar membros da organização')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  const result = await api
    .get(`organizations/${organizationSlug}/members`, {
      searchParams: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    })
    .json<GetMembersOrganizationResponse>()

  console.log('✅ [getMembersOrganization] Resposta recebida:', {
    membersCount: result.members.length,
    totalCount: result.totalCount,
  })

  return result
}
