import type { Role } from '@/lib/auth/'
import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    organization_role: Role // Backend retorna organization_role
    unit_role?: Role // Backend retorna unit_role (opcional)
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
