import { api } from './api-client'

export interface UploadOrganizationDocumentRequest {
  organizationSlug: string
  file: File
  type?: string
}

interface UploadOrganizationDocumentResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadOrganizationDocument({
  organizationSlug,
  file,
  type = 'DOCUMENT',
}: UploadOrganizationDocumentRequest) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const result = await api
    .post(`organizations/${organizationSlug}/documents`, {
      body: formData,
    })
    .json<UploadOrganizationDocumentResponse>()

  return result
}
