import { api } from './api-client'

export interface GetMembersUnitRequest {
  organizationSlug: string
  unitSlug: string
  page?: number
  pageSize?: number
}

export interface UnitMember {
  id: string
  unit_role: string | null
  user: {
    id: string
    name: string | null
    email: string
    avatar_url: string | null
  }
}

interface GetMembersUnitResponse {
  members: UnitMember[]
  totalCount: number
}

export async function getMembersUnit({
  organizationSlug,
  unitSlug,
  page = 1,
  pageSize = 10,
}: GetMembersUnitRequest) {
  const result = await api
    .get(`organizations/${organizationSlug}/units/${unitSlug}/members`, {
      searchParams: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    })
    .json<GetMembersUnitResponse>()

  return result
}
