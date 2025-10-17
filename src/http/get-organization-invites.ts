export interface GetOrganizationInvitesRequest {
  organizationSlug: string
  page?: number
  pageSize?: number
}

export interface OrganizationInvite {
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

export interface GetOrganizationInvitesResponse {
  invites: OrganizationInvite[]
  totalCount: number
}

export async function getOrganizationInvites({
  organizationSlug,
  page,
  pageSize,
}: GetOrganizationInvitesRequest) {
  // Esta função só deve ser usada no client-side
  // Para server components, use getOrganizationInvitesServer()
  const params = new URLSearchParams()
  if (page) params.append('page', page.toString())
  if (pageSize) params.append('pageSize', pageSize.toString())
  
  const url = `/api/invite/${encodeURIComponent(organizationSlug)}/org-invites${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  return result as GetOrganizationInvitesResponse
}
