import { api } from './api-client'

interface GetUnitsResponse {
  units: {
    id: string
    name: string
    slug: string
    location: string
    description: string | null
  }[]
}

export async function getUnits(org: string) {
  try {
    // Em produção no client-side, usar API Route interna para garantir auth
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('🔄 [CLIENT] Using internal API route for units')
      const response = await fetch(`/api/organizations/${org}/units`)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
        throw new Error(error.message || 'Erro ao buscar unidades')
      }
      
      return response.json()
    }

    // Em desenvolvimento ou server-side, usar API direta
    const result = await api
      .get(`organizations/${org}/units`)
      .json<GetUnitsResponse>()

    return result
  } catch (error) {
    console.error('❌ Error fetching units:', {
      org,
      error: error instanceof Error ? error.message : 'Unknown error',
      cause: error instanceof Error ? error.cause : undefined
    })
    
    // Re-throw para o componente tratar
    throw error
  }
}
