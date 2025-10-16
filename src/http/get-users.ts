import { api } from './api-client'

export interface GetUsersRequest {
  organizationSlug: string
  page?: number
  limit?: number
  search?: string
  role?: string
  sortBy?: 'created_at' | 'updated_at' | 'name' | 'email'
  sortOrder?: 'asc' | 'desc'
}

export interface User {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
  created_at: string
  membership: {
    organization_role: string
    unit_role: string | null
  }
}

interface GetUsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export async function getUsers({
  organizationSlug,
  page = 1,
  limit = 20,
  search,
  role,
  sortBy = 'name',
  sortOrder = 'asc',
}: GetUsersRequest) {
  const searchParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  if (search) {
    searchParams.search = search
  }

  if (role) {
    searchParams.role = role
  }

  const result = await api
    .get(`organizations/${organizationSlug}/users`, {
      searchParams,
    })
    .json<GetUsersResponse>()

  return result
}
