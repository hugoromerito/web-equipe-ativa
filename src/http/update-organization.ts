import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name?: string
  description?: string
  domain?: string
  shouldAttachUsersByDomain?: boolean
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  description,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for update organization')
    const response = await fetch(`/api/organizations/${org}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        domain,
        shouldAttachUsersByDomain,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao atualizar organização')
    }
    
    return
  }

  // Em desenvolvimento ou server-side, usar API direta
  await api.put(`organizations/${org}`, {
    json: {
      name,
      description,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
