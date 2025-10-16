import { api } from './api-client'

export interface Invite {
  id: string
  email: string
  role: string
  createdAt: string
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
  unit: {
    name: string
    organization: {
      name: string
    }
  } | null
}

interface GetInvitesResponse {
  invites: Invite[]
}

export async function getInvites() {
  const result = await api
    .get('invites/pending')
    .json<GetInvitesResponse>()

  return result
}
