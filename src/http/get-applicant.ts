import { api } from './api-client'

interface GetApplicantResponse {
  applicant: {
    id: string
    name: string
    birthdate: string // Backend retorna como Date mas é serializado como string
    phone: string | null
    cpf: string | null
    ticket: string | null
    sus_card: string | null
    mother: string | null
    father: string | null
    zip_code: string | null
    state: string | null
    city: string | null
    street: string | null
    neighborhood: string | null
    complement: string | null
    number: string | null
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
