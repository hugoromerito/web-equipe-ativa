import { useQuery } from '@tanstack/react-query'
import {
  getApplicantDemands,
  type GetApplicantDemandsRequest,
} from '@/http'

export function useApplicantDemands(params: GetApplicantDemandsRequest) {
  return useQuery({
    queryKey: [
      'applicant-demands',
      params.organizationSlug,
      params.applicantSlug,
    ],
    queryFn: () => getApplicantDemands(params),
    enabled: !!params.organizationSlug && !!params.applicantSlug,
  })
}
