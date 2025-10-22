import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name?: string
  description?: string
  domain?: string
  shouldAttachUsersByDomain?: boolean
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  description,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      description,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
