import { api } from './api-client'

export interface GetApplicantDemandsRequest {
  organizationSlug: string
  applicantSlug: string
}

export interface ApplicantDemand {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  category: string
  created_at: string
  updated_at: string | null
}

interface GetApplicantDemandsResponse {
  demands: ApplicantDemand[]
  applicant: {
    id: string
    name: string
    phone: string
    birthdate: string
  }
}

export async function getApplicantDemands({
  organizationSlug,
  applicantSlug,
}: GetApplicantDemandsRequest) {
  const result = await api
    .get(
      `organizations/${organizationSlug}/applicant/${applicantSlug}/demands`
    )
    .json<GetApplicantDemandsResponse>()

  return result
}
