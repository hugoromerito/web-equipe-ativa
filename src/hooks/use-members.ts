import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
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
  // Verificar se o token está disponível antes de fazer a requisição
  const hasToken = typeof window !== 'undefined' && !!getCookie('token')
  
  return useQuery({
    queryKey: ['members', 'organization', params.organizationSlug, params],
    queryFn: () =>
      getMembersOrganization({
        ...params,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      }),
    enabled: !!params.organizationSlug && hasToken,
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
