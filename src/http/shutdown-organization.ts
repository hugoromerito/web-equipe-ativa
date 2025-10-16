import { api } from './api-client'

export interface ShutdownOrganizationRequest {
  organizationSlug: string
}

export async function shutdownOrganization({
  organizationSlug,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${organizationSlug}`)
}
