import { api } from './api-client'

export interface GetAttachmentsRequest {
  organizationSlug: string
  demandId?: string
  applicantId?: string
  userId?: string
  type?:
    | 'AVATAR'
    | 'DOCUMENT'
    | 'IMAGE'
    | 'VIDEO'
    | 'AUDIO'
    | 'PDF'
    | 'SPREADSHEET'
    | 'OTHER'
  page?: number
  limit?: number
}

export interface Attachment {
  id: string
  originalName: string
  size: number
  mimeType: string
  type: string
  url: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  } | null
}

interface GetAttachmentsResponse {
  attachments: Attachment[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export async function getAttachments({
  organizationSlug,
  demandId,
  applicantId,
  userId,
  type,
  page = 1,
  limit = 20,
}: GetAttachmentsRequest) {
  const searchParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  }

  if (demandId) {
    searchParams.demandId = demandId
  }

  if (applicantId) {
    searchParams.applicantId = applicantId
  }

  if (userId) {
    searchParams.userId = userId
  }

  if (type) {
    searchParams.type = type
  }

  const result = await api
    .get(`organizations/${organizationSlug}/attachments`, {
      searchParams,
    })
    .json<GetAttachmentsResponse>()

  return result
}
