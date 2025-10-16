import { api } from './api-client'

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
  const result = await api
    .get(`organizations/${organizationSlug}/invites`)
    .json<GetOrganizationInvitesResponse>()

  return result
}
