import { api } from './api-client'

interface CreateApplicantRequest {
  organizationSlug: String
  name: string
  birthdate: Date
  cpf: string
  phone: string
  mother: string | null
  father: string | null
  ticket: string | null
  observation: string | null
  sus_card: string | null
  zip_code: string | null
  state: string | null
  city: string | null
  street: string | null
  neighborhood: string | null
  complement: string | null
  number: string | null
}

type CreateApplicantResponse = {
  applicantId: string
}

export async function createApplicant({
  organizationSlug,
  name,
  birthdate,
  cpf,
  phone,
  mother,
  father,
  ticket,
  observation,
  sus_card,
  zip_code,
  state,
  city,
  street,
  neighborhood,
  complement,
  number,
}: CreateApplicantRequest): Promise<CreateApplicantResponse> {
  const response = await api
    .post(`organizations/${organizationSlug}/applicants`, {
      json: {
        name,
        birthdate,
        cpf,
        phone,
        mother,
        father,
        ticket,
        observation,
        sus_card,
        zip_code,
        state,
        city,
        street,
        neighborhood,
        complement,
        number,
      },
    })
    .json<CreateApplicantResponse>()

  return response
}
