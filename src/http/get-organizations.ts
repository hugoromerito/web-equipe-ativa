import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for organizations')
    const response = await fetch('/api/organizations')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao buscar organizações')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  const result = await api.get('organizations').json<GetOrganizationsResponse>()

  return result
}
