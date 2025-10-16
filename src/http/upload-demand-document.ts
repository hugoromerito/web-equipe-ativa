import { api } from './api-client'

export interface UploadDemandDocumentRequest {
  organizationSlug: string
  demandId: string
  file: File
  type?: string
}

interface UploadDemandDocumentResponse {
  attachmentId: string
  url: string
  originalName: string
  type: string
}

export async function uploadDemandDocument({
  organizationSlug,
  demandId,
  file,
  type = 'DOCUMENT',
}: UploadDemandDocumentRequest) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const result = await api
    .post(`organizations/${organizationSlug}/demands/${demandId}/documents`, {
      body: formData,
    })
    .json<UploadDemandDocumentResponse>()

  return result
}
