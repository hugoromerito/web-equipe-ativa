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
      headers: {
        // Remove o Content-Type para que o browser defina automaticamente com o boundary correto
        'Content-Type': undefined,
      },
    })
    .json<UploadOrganizationAvatarResponse>()

  return result
}
