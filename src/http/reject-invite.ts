export async function rejectInvite(inviteId: string) {
  // Detectar se estamos no server-side ou client-side
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
    : ''
    
  const response = await fetch(`${baseUrl}/api/invite/reject/${encodeURIComponent(inviteId)}`, {
    method: 'POST',
    // Removido headers desnecessários para POST sem body
  })

  if (response.status === 204) return null

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || errorData.error || 'Erro ao rejeitar convite')
  }

  return null
}
