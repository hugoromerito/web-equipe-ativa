export interface GetOrganizationInvitesRequest {
  organizationSlug: string
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

interface GetOrganizationInvitesResponse {
  invites: OrganizationInvite[]
}

export async function getOrganizationInvites({
  organizationSlug,
}: GetOrganizationInvitesRequest) {
  // Esta função só deve ser usada no client-side
  // Para server components, use getOrganizationInvitesServer()
  const response = await fetch(`/api/invite/${encodeURIComponent(organizationSlug)}/org-invites`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar convites')
  }

  const result = await response.json()
  return result as GetOrganizationInvitesResponse
}
