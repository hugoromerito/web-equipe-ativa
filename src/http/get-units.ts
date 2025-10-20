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
