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
  try {
    const result = await api
      .get(`organizations/${org}/membership`)
      .json<GetMembershipResponse>()

    return result
  } catch (error) {
    console.error('❌ Error fetching membership:', {
      org,
      error: error instanceof Error ? error.message : 'Unknown error',
      cause: error instanceof Error ? error.cause : undefined
    })
    
    throw error
  }
}
