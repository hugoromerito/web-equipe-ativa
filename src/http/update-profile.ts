import { api } from './api-client'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  password?: string
  currentPassword?: string
}

export async function updateProfile({
  name,
  email,
  password,
  currentPassword,
}: UpdateProfileRequest) {
  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for update profile')
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        currentPassword,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  await api
    .patch('profile', {
      json: {
        name,
        email,
        password,
        currentPassword,
      },
    })
    .json()
}
