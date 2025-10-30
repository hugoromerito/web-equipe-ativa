import { api } from './api-client'

export interface UpdateDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandId: string
  title?: string
  description?: string
  priority?: string
  status?: string
  reason?: string // Motivo da mudança de status (para auditoria)
}

interface UpdateDemandResponse {
  demand: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    updatedAt: string | null
  }
}

export async function updateDemand({
  organizationSlug,
  unitSlug,
  demandId,
  title,
  description,
  priority,
  status,
  reason,
}: UpdateDemandRequest) {
  // Construir o payload apenas com campos definidos
  const payload: Record<string, any> = {}
  
  if (title !== undefined) payload.title = title
  if (description !== undefined) payload.description = description
  if (priority !== undefined) payload.priority = priority
  if (status !== undefined) payload.status = status
  if (reason !== undefined) payload.reason = reason

  console.log('🔄 Atualizando demanda:', {
    url: `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandId}`,
    payload,
  })

  try {
    const result = await api
      .patch(
        `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandId}`,
        {
          json: payload,
        }
      )
      .json<UpdateDemandResponse>()

    console.log('✅ Demanda atualizada com sucesso:', result)
    return result
  } catch (error: any) {
    console.error('❌ Erro ao atualizar demanda:', error)
    
    // Tentar extrair mais informações do erro
    if (error?.response) {
      try {
        const errorBody = await error.response.text()
        console.error('📋 Resposta do servidor:', errorBody)
      } catch (e) {
        console.error('⚠️ Não foi possível ler o corpo da resposta')
      }
    }
    
    throw error
  }
}
