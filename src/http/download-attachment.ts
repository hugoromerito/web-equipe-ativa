import { api } from './api-client'

export interface DownloadAttachmentRequest {
  organizationSlug: string
  attachmentId: string
  inline?: boolean
}

export async function downloadAttachment({
  organizationSlug,
  attachmentId,
  inline = false,
}: DownloadAttachmentRequest) {
  const searchParams: Record<string, string> = {}

  if (inline) {
    searchParams.inline = 'true'
  }

  const response = await api.get(
    `organizations/${organizationSlug}/attachments/${attachmentId}/download`,
    {
      searchParams,
    }
  )

  return response
}
