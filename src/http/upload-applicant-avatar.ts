import { api } from './api-client'

export interface UploadApplicantAvatarRequest {
  organizationSlug: string
  applicantId: string
  file: File
}

interface UploadApplicantAvatarResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadApplicantAvatar({
  organizationSlug,
  applicantId,
  file,
}: UploadApplicantAvatarRequest) {
  const formData = new FormData()
  formData.append('file', file)

  const result = await api
    .post(
      `organizations/${organizationSlug}/applicants/${applicantId}/avatar`,
      {
        body: formData,
      }
    )
    .json<UploadApplicantAvatarResponse>()

  return result
}
