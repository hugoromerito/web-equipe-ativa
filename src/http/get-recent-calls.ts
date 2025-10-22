// src/http/get-recent-calls.ts
import { api } from './api-client'

export interface RecentCall {
  demandId: string
  patientName: string
  patientAvatar?: string
  professionalName?: string
  scheduledTime?: string
  updatedAt: string
}

interface GetRecentCallsRequest {
  organizationSlug: string
  unitSlug: string
  minutes?: number // Quantos minutos atrás buscar (padrão: 5)
}

interface GetRecentCallsResponse {
  calls: RecentCall[]
}

export async function getRecentCalls({
  organizationSlug,
  unitSlug,
  minutes = 5,
}: GetRecentCallsRequest) {
  const result = await api
    .get(
      `organizations/${organizationSlug}/units/${unitSlug}/demands/recent-calls`,
      {
        searchParams: {
          minutes: minutes.toString(),
        },
      }
    )
    .json<GetRecentCallsResponse>()

  return result
}
