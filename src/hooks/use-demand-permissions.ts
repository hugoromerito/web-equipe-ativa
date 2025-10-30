// hooks/use-demand-permissions.ts
// Hook para gerenciar permissões de demands baseado em role e LGPD

import { useMemo } from 'react'
import type { Role } from '@/lib/auth/roles'
import { getAvailableStatusTransitions, canChangeStatus, type DemandStatus } from '@/utils/demand-status-permissions'

export interface Demand {
  id: string
  status: DemandStatus
  responsibleId?: string | null
  memberId?: string | null
  [key: string]: any
}

export function useDemandPermissions(
  demand: Demand | null | undefined,
  userRole: Role | null | undefined,
  currentMemberId: string | null | undefined
) {
  // Verifica se ANALYST pode visualizar esta demand (LGPD)
  const canView = useMemo(() => {
    if (!demand || !userRole) return false
    
    if (userRole === 'ANALYST') {
      // ANALYST só pode ver suas próprias demands
      const demandMemberId = demand.responsibleId || demand.memberId
      return demandMemberId === currentMemberId
    }
    
    // Outros roles podem ver todas as demands da unidade
    return ['ADMIN', 'CLERK', 'MANAGER', 'BILLING'].includes(userRole)
  }, [demand, userRole, currentMemberId])

  // Verifica se pode editar a demand
  const canEdit = useMemo(() => {
    if (!demand || !userRole || !canView) return false
    
    if (userRole === 'ANALYST') {
      // ANALYST só pode editar suas próprias demands em status permitidos
      const demandMemberId = demand.responsibleId || demand.memberId
      return (
        demandMemberId === currentMemberId &&
        canChangeStatus(userRole, demand.status as DemandStatus)
      )
    }
    
    if (userRole === 'CLERK') {
      return canChangeStatus(userRole, demand.status as DemandStatus)
    }
    
    if (userRole === 'BILLING') {
      return demand.status === 'RESOLVED'
    }
    
    if (userRole === 'ADMIN') {
      return canChangeStatus(userRole, demand.status as DemandStatus)
    }
    
    // MANAGER não pode editar status
    return false
  }, [demand, userRole, currentMemberId, canView])

  // Retorna os status disponíveis para transição
  const availableStatuses = useMemo(() => {
    if (!demand || !userRole || !canEdit) return []
    
    return getAvailableStatusTransitions(
      userRole, 
      demand.status as DemandStatus
    )
  }, [userRole, demand, canEdit])

  // Verifica se pode reatribuir a demand
  const canReassign = useMemo(() => {
    if (!demand || !userRole) return false
    
    if (userRole === 'ANALYST') {
      // ANALYST não pode reatribuir demands de outros
      const demandMemberId = demand.responsibleId || demand.memberId
      return demandMemberId === currentMemberId
    }
    
    // ADMIN e CLERK podem reatribuir
    return ['ADMIN', 'CLERK'].includes(userRole)
  }, [demand, userRole, currentMemberId])

  // Mensagem de acesso negado personalizada
  const accessDeniedMessage = useMemo(() => {
    if (!userRole) return 'Você não tem permissão para acessar esta demanda'
    
    if (userRole === 'ANALYST' && demand) {
      return 'Você só pode visualizar suas próprias demandas'
    }
    
    return 'Você não tem permissão para acessar esta demanda'
  }, [userRole, demand])

  return { 
    canView, 
    canEdit, 
    canReassign,
    availableStatuses,
    accessDeniedMessage
  }
}
