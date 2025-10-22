import { cookies } from 'next/headers'

interface GetMembersServerResponse {
  members: {
    id: string
    userId: string
    role: string
    user: {
      name: string | null
      email: string
      avatarUrl: string | null
    }
  }[]
}

interface GetMembersServerRequest {
  organizationSlug: string
  unitSlug: string
}

export async function getMembersServer({
  organizationSlug,
  unitSlug,
}: GetMembersServerRequest): Promise<GetMembersServerResponse> {
  // Esta função só pode ser chamada em Server Components
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    console.error('🔒 [SERVER] No token found for members request')
    return { members: [] }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/organizations/${organizationSlug}/units/${unitSlug}/members`

  console.log('🔐 [SERVER] Fetching members:', url)
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
    console.error('❌ [SERVER] Members fetch error:', {
      status: response.status,
      error: errorData,
    })
    throw new Error(
      errorData.message || errorData.error || 'Erro ao buscar membros'
    )
  }

  const result = await response.json()
  console.log('✅ [SERVER] Members fetched:', result.members?.length || 0)
  return result
}
