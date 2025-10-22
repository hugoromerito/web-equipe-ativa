import { cookies } from 'next/headers'

export interface JobTitle {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface GetJobTitlesServerResponse {
  jobTitles: JobTitle[]
}

export async function getJobTitlesServer(
  organizationSlug: string
): Promise<GetJobTitlesServerResponse> {
  // Esta função só pode ser chamada em Server Components
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    console.error('🔒 [SERVER] No token found for job-titles request')
    return { jobTitles: [] }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/organizations/${organizationSlug}/job-titles`

  console.log('🔐 [SERVER] Fetching job-titles:', url)
  console.log('🔐 [SERVER] Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Garantir dados atualizados
  })

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Erro desconhecido' }))
    console.error('❌ [SERVER] Job-titles fetch error:', {
      status: response.status,
      error: errorData,
    })
    throw new Error(
      errorData.message || errorData.error || 'Erro ao buscar cargos'
    )
  }

  const result = await response.json()
  console.log('✅ [SERVER] Job-titles fetched:', result.jobTitles?.length || 0)
  return result
}
