import type { Role } from '@/lib/auth/'
import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    orgRole: Role
    unitRole: Role
    name: string | null
    avatarUrl: string | null
    email: string
    isOnline: boolean
    lastSeen: string | null
  }[]
}

interface GetMembersRequest {
  organizationSlug: string
  unitSlug: string
}

export async function getMembers({
  organizationSlug,
  unitSlug,
}: GetMembersRequest): Promise<GetMembersResponse> {
  const result = await api
    .get(`organizations/${organizationSlug}/units/${unitSlug}/members`)
    .json<GetMembersResponse>()

  return result
}
