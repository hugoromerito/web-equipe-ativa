import { api } from './api-client'

export interface GetMyDemandsRequest {
  organizationSlug: string
  unitSlug: string
  page?: number
  limit?: number
  category?: string
  status?: string
  priority?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  created_at?: string
  updated_at?: string
}

export interface MyDemand {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  scheduled_date: string | null
  scheduled_time: string | null
  responsible_id: string
  created_at: string
  updated_at: string | null
  author: string
  applicant_name: string
  created_by_member_name: string
  responsible: {
    id: string
    name: string
    email: string
    job_title: string
  } | null
}

export interface MyDemandsPagination {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface GetMyDemandsResponse {
  demands: MyDemand[]
  pagination: MyDemandsPagination
}

export async function getMyDemands({
  organizationSlug,
  unitSlug,
  page = 1,
  limit = 20,
  category,
  status,
  priority,
  search,
  sort_by,
  sort_order,
  created_at,
  updated_at,
}: GetMyDemandsRequest): Promise<GetMyDemandsResponse> {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(page))
  searchParams.set('limit', String(limit))

  if (category) searchParams.set('category', category)
  if (status) searchParams.set('status', status)
  if (priority) searchParams.set('priority', priority)
  if (search) searchParams.set('search', search)
  if (sort_by) searchParams.set('sort_by', sort_by)
  if (sort_order) searchParams.set('sort_order', sort_order)
  if (created_at) searchParams.set('created_at', created_at)
  if (updated_at) searchParams.set('updated_at', updated_at)

  const result = await api
    .get(
      `organizations/${organizationSlug}/units/${unitSlug}/my-demands`,
      {
        searchParams,
      }
    )
    .json<GetMyDemandsResponse>()

  return result
}
