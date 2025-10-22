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
