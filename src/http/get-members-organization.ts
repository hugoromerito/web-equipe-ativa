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
