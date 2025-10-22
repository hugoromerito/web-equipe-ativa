import { api } from './api-client'

export interface UploadUserAvatarRequest {
  userId: string
  file: File
}

interface UploadUserAvatarResponse {
  attachmentId: string
  url: string
}

export async function uploadUserAvatar({ 
  userId, 
  file 
}: UploadUserAvatarRequest) {
  const formData = new FormData()
  formData.append('file', file)

  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for user avatar upload')
    const response = await fetch(`/api/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(error.message || 'Erro ao fazer upload do avatar')
    }
    
    return response.json()
  }

  // Em desenvolvimento ou server-side, usar API direta
  const result = await api
    .post(`users/${userId}/avatar`, {
      body: formData,
      headers: {
        // Remove o Content-Type para que o browser defina automaticamente com o boundary correto
        'Content-Type': undefined,
      },
    })
    .json<UploadUserAvatarResponse>()

  return result
}
