import { api } from './api-client'

export interface UploadMemberAvatarRequest {
  organizationSlug: string
  userId: string
  file: File
}

interface UploadMemberAvatarResponse {
  attachmentId: string
  url: string
}

export async function uploadMemberAvatar({
  organizationSlug,
  userId,
  file,
}: UploadMemberAvatarRequest) {
  const formData = new FormData()
  formData.append('file', file)

  const result = await api
    .post(`organizations/${organizationSlug}/users/${userId}/avatar`, {
      body: formData,
    })
    .json<UploadMemberAvatarResponse>()

  return result
}
