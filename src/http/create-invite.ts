import { api } from './api-client'

export interface CreateInviteRequest {
  organizationSlug: string
  email: string
  role: string
  unitSlug?: string
}

interface CreateInviteResponse {
  inviteId: string
}

export async function createInvite({
  organizationSlug,
  email,
  role,
  unitSlug,
}: CreateInviteRequest) {
  const result = await api
    .post(`organizations/${organizationSlug}/invites`, {
      json: {
        email,
        role,
        unitSlug,
      },
    })
    .json<CreateInviteResponse>()

  return result
}
