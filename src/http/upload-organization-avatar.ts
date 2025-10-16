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

  const result = await api
    .post(`organizations/${organizationSlug}/avatar`, {
      body: formData,
    })
    .json<UploadOrganizationAvatarResponse>()

  return result
}
