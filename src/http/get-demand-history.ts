// http/get-demand-history.ts
// API para buscar histórico de auditoria de mudanças de status

import { api } from './api-client'

export interface DemandStatusAuditLog {
  id: string
  demandId: string
  previousStatus: string
  newStatus: string
  changedByUserId: string
  changedByMemberId: string | null
  changedByUserName: string
  changedByRole: string
  reason: string | null
  metadata: Record<string, any> | null
  changedAt: string
}

export interface GetDemandHistoryResponse {
  history: DemandStatusAuditLog[]
}

/**
 * Busca o histórico de mudanças de status de uma demand
 */
export async function getDemandHistory(
  organizationSlug: string,
  unitSlug: string,
  demandId: string
): Promise<DemandStatusAuditLog[]> {
  try {
    const result = await api
      .get(
        `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandId}/history`
      )
      .json<GetDemandHistoryResponse>()

    return result.history || []
  } catch (error: any) {
    console.error('❌ Erro ao buscar histórico da demand:', error)
    
    // Se o endpoint não existir ainda, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('⚠️ Endpoint de histórico ainda não implementado no backend')
      return []
    }
    
    throw error
  }
}

/**
 * Busca histórico de auditoria de um usuário específico
 */
export async function getUserAuditHistory(
  organizationSlug: string,
  userId: string,
  limit: number = 50
): Promise<DemandStatusAuditLog[]> {
  try {
    const result = await api
      .get(
        `organizations/${organizationSlug}/users/${userId}/audit-history?limit=${limit}`
      )
      .json<GetDemandHistoryResponse>()

    return result.history || []
  } catch (error: any) {
    console.error('❌ Erro ao buscar histórico do usuário:', error)
    
    if (error.response?.status === 404) {
      console.warn('⚠️ Endpoint de histórico de usuário ainda não implementado')
      return []
    }
    
    throw error
  }
}
