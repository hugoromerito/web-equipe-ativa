import { api } from './api-client'
import { convertDaysToApi, type ApiWeekDay } from '@/constants/week-days'

export interface UpdateWorkingDaysRequest {
  workingDays: ApiWeekDay[] // ['SEGUNDA', 'TERCA', 'QUARTA', ...]
}

export async function updateMemberWorkingDays(
  organizationSlug: string,
  memberId: string,
  workingDays: string[]
) {
  // Converte os dias de inglês (lowercase) para português (uppercase)
  const convertedDays = convertDaysToApi(workingDays)

  await api.patch(
    `organizations/${organizationSlug}/members/${memberId}/working-days`,
    {
      json: {
        workingDays: convertedDays,
      },
    }
  )
}
