import { api } from './api-client'

interface CreateDemandRequest {
  organizationSlug: String
  unitSlug: String
  applicantSlug: String
  title: String
  description: String
  // 🆕 Campos de agendamento (opcionais)
  responsibleId?: String
  scheduledDate?: String // yyyy-MM-dd
  scheduledTime?: String // HH:mm
  // Campos de endereço (opcionais/legados)
  zip_code?: String | null
  state?: String | null
  city?: String | null
  street?: String | null
  complement?: String | null
  number?: String | null
  neighborhood?: String | null
}

type CreateDemandResponse = void

export async function createDemand({
  organizationSlug,
  unitSlug,
  applicantSlug,
  title,
  description,
  responsibleId,
  scheduledDate,
  scheduledTime,
  street,
  complement,
  number,
  neighborhood,
  zip_code,
  state,
  city,
}: CreateDemandRequest): Promise<CreateDemandResponse> {
  await api.post(
    `organizations/${organizationSlug}/units/${unitSlug}/applicants/${applicantSlug}/demands`,
    {
      json: {
        organizationSlug,
        unitSlug,
        applicantSlug,
        title,
        description,
        // 🆕 Inclui dados de agendamento se fornecidos
        ...(responsibleId && { responsibleId }),
        ...(scheduledDate && { scheduledDate }),
        ...(scheduledTime && { scheduledTime }),
        // Dados de endereço (opcionais)
        street,
        complement,
        number,
        neighborhood,
        zip_code,
        state,
        city,
      },
    },
  )
}
