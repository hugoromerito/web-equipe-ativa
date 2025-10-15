import { api } from './api-client'

interface GetApplicantResponse {
  applicant: {
    id: string
    name: string
    birthdate: string // Backend retorna como Date mas é serializado como string
    phone: string
    cpf: string
    ticket: string | null
    mother: string | null
    father: string | null
    observation: string | null
    created_at: string
    updated_at: string | null
  }
}

interface GetApplicantRequest {
  organizationSlug: string
  applicantSlug: string
}

export async function getApplicant({
  organizationSlug,
  applicantSlug,
}: GetApplicantRequest): Promise<GetApplicantResponse['applicant']> {
  const result = await api
    .get(`organizations/${organizationSlug}/applicant/${applicantSlug}`)
    .json<GetApplicantResponse>()

  return result.applicant
}
