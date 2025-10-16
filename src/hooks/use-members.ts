import { useQuery } from '@tanstack/react-query'
import {
  getMembersOrganization,
  type GetMembersOrganizationRequest,
  getMembersUnit,
  type GetMembersUnitRequest,
} from '@/http'

export function useMembersOrganization(
  params: Omit<GetMembersOrganizationRequest, 'page' | 'pageSize'> & {
    page?: number
    pageSize?: number
  }
) {
  return useQuery({
    queryKey: ['members', 'organization', params.organizationSlug, params],
    queryFn: () =>
      getMembersOrganization({
        ...params,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      }),
    enabled: !!params.organizationSlug,
  })
}

export function useMembersUnit(
  params: Omit<GetMembersUnitRequest, 'page' | 'pageSize'> & {
    page?: number
    pageSize?: number
  }
) {
  return useQuery({
    queryKey: [
      'members',
      'unit',
      params.organizationSlug,
      params.unitSlug,
      params,
    ],
    queryFn: () =>
      getMembersUnit({
        ...params,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      }),
    enabled: !!params.organizationSlug && !!params.unitSlug,
  })
}
