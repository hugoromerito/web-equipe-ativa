import { api } from './api-client'

export interface UploadApplicantDocumentRequest {
  organizationSlug: string
  applicantId: string
  file: File
  type?: string
}

interface UploadApplicantDocumentResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadApplicantDocument({
  organizationSlug,
  applicantId,
  file,
  type = 'DOCUMENT',
}: UploadApplicantDocumentRequest) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const result = await api
    .post(
      `organizations/${organizationSlug}/applicants/${applicantId}/documents`,
      {
        body: formData,
      }
    )
    .json<UploadApplicantDocumentResponse>()

  return result
}
