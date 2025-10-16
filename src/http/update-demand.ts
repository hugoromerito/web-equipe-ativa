import { api } from './api-client'

export interface UpdateDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandId: string
  title?: string
  description?: string
  priority?: string
  status?: string
}

interface UpdateDemandResponse {
  demand: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    updatedAt: string | null
  }
}

export async function updateDemand({
  organizationSlug,
  unitSlug,
  demandId,
  title,
  description,
  priority,
  status,
}: UpdateDemandRequest) {
  const result = await api
    .patch(
      `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandId}`,
      {
        json: {
          title,
          description,
          priority,
          status,
        },
      }
    )
    .json<UpdateDemandResponse>()

  return result
}
