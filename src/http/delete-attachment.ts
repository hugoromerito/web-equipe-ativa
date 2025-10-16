import { api } from './api-client'

export interface DeleteAttachmentRequest {
  organizationSlug: string
  attachmentId: string
}

export async function deleteAttachment({
  organizationSlug,
  attachmentId,
}: DeleteAttachmentRequest) {
  await api.delete(
    `organizations/${organizationSlug}/attachments/${attachmentId}`
  )
}
