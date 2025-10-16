import { api } from './api-client'

export interface UploadUserAvatarRequest {
  file: File
}

interface UploadUserAvatarResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadUserAvatar({ file }: UploadUserAvatarRequest) {
  const formData = new FormData()
  formData.append('file', file)

  const result = await api
    .post('user/avatar', {
      body: formData,
    })
    .json<UploadUserAvatarResponse>()

  return result
}
