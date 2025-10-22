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
    // Em produção no client-side, usar API Route interna para garantir auth
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('🔄 [CLIENT] Using internal API route for membership')
      const response = await fetch(`/api/organizations/${org}/membership`)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
        throw new Error(error.message || 'Erro ao buscar membership')
      }
      
      return response.json()
    }

    // Em desenvolvimento ou server-side, usar API direta
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
