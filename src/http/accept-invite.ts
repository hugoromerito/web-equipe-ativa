export async function acceptInvite(inviteId: string) {
  // Detectar se estamos no server-side ou client-side
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
    : ''
    
  const response = await fetch(`${baseUrl}/api/invite/accept/${encodeURIComponent(inviteId)}`, {
    method: 'POST',
    // Removido headers desnecessários para POST sem body
  })

  // Nossa rota proxy retorna 204 em caso de sucesso
  if (response.status === 204) return null

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao aceitar convite')
  }

  return null
}
