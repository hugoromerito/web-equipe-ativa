export interface GetPatientsRequest {
  organizationSlug: string
  page?: number
  pageSize?: number
  search?: string
}

export interface Patient {
  id: string
  slug: string
  name: string
  phone: string | null
  cpf: string | null
  birthdate: string | null // Chamado de 'birthdate' no backend, não 'birthDate'
  ticket: string | null
  mother: string | null
  father: string | null
  observation: string | null
  created_at: Date // Backend usa snake_case
  updated_at: Date | null // Backend usa snake_case
}

export interface GetPatientsResponse {
  applicants: Patient[] // Backend retorna 'applicants' não 'patients'
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export async function getPatients({
  organizationSlug,
  page,
  pageSize,
  search,
}: GetPatientsRequest) {
  // Esta função só deve ser usada no client-side
  // Para server components, use getPatientsServer()
  const params = new URLSearchParams()
  if (page) params.append('page', page.toString())
  if (pageSize) params.append('pageSize', pageSize.toString())
  if (search) params.append('search', search)
  
  const url = `/api/patients/${encodeURIComponent(organizationSlug)}${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao buscar pacientes')
  }

  const result = await response.json()
  return result as GetPatientsResponse
}