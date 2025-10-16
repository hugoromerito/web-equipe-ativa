// src/http/update-demand-status.ts
// DEPRECATED: Use update-demand.ts instead
import { api } from './api-client'

interface UpdateDemandStatusRequest {
  organizationSlug: string
  unitSlug: string
  demandSlug: string
  status: string
}

export async function updateDemandStatus({
  organizationSlug,
  unitSlug,
  demandSlug,
  status,
}: UpdateDemandStatusRequest): Promise<void> {
  await api.patch(
    `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandSlug}`,
    { json: { status } },
  )
}
