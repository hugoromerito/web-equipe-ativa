import type { DemandCategory, DemandPriority, DemandStatus } from '@/lib/auth/'
import { api } from './api-client'

interface GetDemandsResponse {
  demands: {
    id: string
    title: string
    description: string
    status: DemandStatus
    priority: DemandPriority
    category: DemandCategory
    zip_code: string | null
    state: string | null
    city: string | null
    neighborhood: string | null
    street: string | null
    complement: string | null
    number: string | null
    created_at: string
    updated_at: string | null
    author: string | null
    created_by_member_name: string
    applicant_name: string | null
  }[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

interface GetDemandsRequest {
  organizationSlug: string
  unitSlug: string
  page?: number
  limit?: number
  category?: string
  status?: string
  priority?: string
  created_at?: Date
  updated_at?: Date
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'status'
  sort_order?: 'asc' | 'desc'
}

export async function getDemands({
  organizationSlug,
  unitSlug,
  page = 1,
  limit = 20,
  category,
  status,
  priority,
  created_at,
  updated_at,
  search,
  sort_by = 'created_at',
  sort_order = 'desc',
}: GetDemandsRequest): Promise<GetDemandsResponse> {
  try {
    // Validate required parameters
    if (!organizationSlug?.trim()) {
      throw new Error('Organization slug is required')
    }
    if (!unitSlug?.trim()) {
      throw new Error('Unit slug is required')
    }

    // Build search parameters object - ky handles URLSearchParams automatically
    const searchParams: Record<string, string | number> = {
      page,
      limit,
      sort_by,
      sort_order,
    }

    // Add optional filters only if they have meaningful values
    if (category?.trim()) {
      searchParams.category = category.trim()
    }
    if (status?.trim()) {
      searchParams.status = status.trim()
    }
    if (priority?.trim()) {
      searchParams.priority = priority.trim()
    }
    if (search?.trim()) {
      searchParams.search = search.trim()
    }
    
    // Handle date parameters - send as ISO strings
    if (created_at && created_at instanceof Date && !isNaN(created_at.getTime())) {
      searchParams.created_at = created_at.toISOString()
    }
    if (updated_at && updated_at instanceof Date && !isNaN(updated_at.getTime())) {
      searchParams.updated_at = updated_at.toISOString()
    }



    // Use ky's searchParams option instead of manual URL construction
    const result = await api
      .get(`organizations/${organizationSlug}/units/${unitSlug}/demands`, {
        searchParams
      })
      .json<GetDemandsResponse>()


    // Validate response structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format: response is not an object')
    }

    if (!Array.isArray(result.demands)) {
      throw new Error('Invalid response format: demands is not an array')
    }

    if (!result.pagination || typeof result.pagination !== 'object') {
      throw new Error('Invalid response format: pagination is missing or invalid')
    }

    return result
  } catch (error) {
    console.error('❌ API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      organizationSlug,
      unitSlug,
      requestParams: {
        page,
        limit,
        category,
        status,
        priority,
        search,
        sort_by,
        sort_order
      }
    })

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for common HTTP errors
      if (error.message.includes('404')) {
        throw new Error(`Organization "${organizationSlug}" or unit "${unitSlug}" not found`)
      }
      if (error.message.includes('401')) {
        throw new Error('Authentication required. Please log in again.')
      }
      if (error.message.includes('403')) {
        throw new Error('You do not have permission to view these demands')
      }
      if (error.message.includes('500')) {
        throw new Error('Server error occurred. Please try again later.')
      }
      
      throw new Error(`Failed to fetch demands: ${error.message}`)
    } else {
      throw new Error('Failed to fetch demands: Unknown error occurred')
    }
  }
}