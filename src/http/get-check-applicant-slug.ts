import { api } from './api-client'

interface GetCheckApplicantResponse {
  exists: boolean
  applicant?: {
    id: string
    name: string
  }
}

interface GetCheckApplicantRequest {
  organizationSlug: string
  cpf: string
}

export async function getCheckApplicant({
  organizationSlug,
  cpf,
}: GetCheckApplicantRequest) {
  const result = await api
    .get(`organizations/${organizationSlug}/applicant`, {
      searchParams: { cpf },
    })
    .json<GetCheckApplicantResponse>()

  return result
}
