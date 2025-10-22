import { api } from './api-client'

export interface UploadOrganizationAvatarRequest {
  organizationSlug: string
  file: File
}

interface UploadOrganizationAvatarResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadOrganizationAvatar({
  organizationSlug,
  file,
}: UploadOrganizationAvatarRequest) {
  const formData = new FormData()
  formData.append('file', file)

  // Em produção no client-side, usar API Route interna para garantir auth
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 [CLIENT] Using internal API route for organization avatar upload')
    const response = await fetch(`/api/organizations/${organizationSlug}/avatar`, {
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
    .post(`organizations/${organizationSlug}/avatar`, {
      body: formData,
      headers: {
        // Remove o Content-Type para que o browser defina automaticamente com o boundary correto
        'Content-Type': undefined,
      },
    })
    .json<UploadOrganizationAvatarResponse>()

  return result
}
