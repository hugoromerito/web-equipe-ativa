import type { Role } from '@/lib/auth/'
import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    orgRole: Role,
    unitRole: Role,
    organizationId: string
    userId: string
  }
}

export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return result
}
