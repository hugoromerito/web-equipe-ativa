import { api } from './api-client'

export interface JobTitle {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface GetJobTitlesResponse {
  jobTitles: JobTitle[]
}

export async function getJobTitles(organizationSlug: string) {
  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for job-titles')
    const response = await fetch(`/api/organizations/${organizationSlug}/job-titles`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao buscar cargos')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  const result = await api
    .get(`organizations/${organizationSlug}/job-titles`)
    .json<GetJobTitlesResponse>()

  return result
}
