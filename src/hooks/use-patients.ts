import { useQuery } from '@tanstack/react-query'
import { getPatients, type GetPatientsRequest } from '@/http/get-patients'

export function usePatients(params: GetPatientsRequest) {
  return useQuery({
    queryKey: ['patients', params.organizationSlug, params.page, params.pageSize, params.search],
    queryFn: () => getPatients(params),
    enabled: !!params.organizationSlug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}