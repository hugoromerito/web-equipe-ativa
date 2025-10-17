import { cookies } from 'next/headers'

export async function acceptInviteServer(inviteId: string) {
  // Esta função só pode ser chamada em Server Components/Actions
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  console.log('🔍 Debug acceptInviteServer:', {
    inviteId,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'N/A'
  })
  
  if (!token) {
    throw new Error('Token não encontrado')
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/invites/${encodeURIComponent(inviteId)}/accept`
  
  console.log('🌐 Fazendo requisição para aceitar convite:', url)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`
      // Removido Content-Type pois não há body
    },
  })

  console.log('📡 Resposta da API (accept):', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  })

  // Aceitar convite geralmente retorna 204 No Content
  if (response.status === 204) {
    console.log('✅ Convite aceito com sucesso')
    return null
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    console.error('❌ Erro da API backend (accept):', errorData)
    throw new Error(errorData.message || errorData.error || 'Erro ao aceitar convite')
  }

  return null
}