export interface CreateInviteRequest {
  organizationSlug: string
  email: string
  role: string
  unitSlug?: string
}

interface CreateInviteResponse {
  inviteId: string
}

export async function createInvite({
  organizationSlug,
  email,
  role,
  unitSlug,
}: CreateInviteRequest) {
  try {
    // Detectar se estamos no server-side ou client-side
    const baseUrl = typeof window === 'undefined' 
      ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
      : ''
      
    const payload: any = {
      email,
      role,
    }
    
    // Só adiciona unitSlug se não for undefined ou string vazia
    if (unitSlug && unitSlug.trim()) {
      payload.unitSlug = unitSlug.trim()
    }
    
    console.log('📦 Payload final:', payload)
    
    // Usar nossa rota de API local para evitar problemas de CORS
    const response = await fetch(`${baseUrl}/api/invite/${organizationSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(errorData.message || errorData.error || 'Erro ao criar convite')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('❌ Erro ao criar convite:', error)
    
    // Erro de rede ou outro tipo
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
  }
}
