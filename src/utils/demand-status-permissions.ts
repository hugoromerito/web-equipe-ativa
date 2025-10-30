// utils/demand-status-permissions.ts
// Sistema de permissões de status baseado nas atualizações do backend (26/10/2025)

import type { Role } from '@/lib/auth/roles'

export type DemandStatus = 
  | 'PENDING' 
  | 'CHECK_IN' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'BILLED' 
  | 'REJECTED'

// Transições válidas de status (regras de negócio)
const VALID_STATUS_TRANSITIONS: Record<DemandStatus, DemandStatus[]> = {
  PENDING: ['CHECK_IN', 'IN_PROGRESS', 'RESOLVED'],
  CHECK_IN: ['IN_PROGRESS', 'RESOLVED'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['BILLED'],
  REJECTED: [], // Status final, não pode ser alterado
  BILLED: [], // Status final, não pode ser alterado
}

// Permissões por role (baseado no backend atualizado)
const ROLE_STATUS_PERMISSIONS: Record<
  Role,
  { from: DemandStatus[]; to: DemandStatus[] }
> = {
  ADMIN: {
    from: ['PENDING', 'CHECK_IN', 'IN_PROGRESS', 'RESOLVED'],
    to: ['CHECK_IN', 'IN_PROGRESS', 'RESOLVED', 'BILLED'],
  },
  MANAGER: {
    from: [], // MANAGER não pode alterar status
    to: [],
  },
  CLERK: {
    from: ['PENDING', 'CHECK_IN', 'IN_PROGRESS'],
    to: ['CHECK_IN', 'IN_PROGRESS', 'RESOLVED'],
  },
  ANALYST: {
    from: ['CHECK_IN', 'IN_PROGRESS'],
    to: ['IN_PROGRESS', 'RESOLVED'],
  },
  BILLING: {
    from: ['RESOLVED'],
    to: ['BILLED'],
  },
}

/**
 * Retorna os status disponíveis para transição baseado na role e status atual
 */
export function getAvailableStatusTransitions(
  role: Role,
  currentStatus: DemandStatus
): DemandStatus[] {
  const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || []
  const rolePermissions = ROLE_STATUS_PERMISSIONS[role]

  if (!rolePermissions) {
    return []
  }

  // Filtra apenas os status que a role tem permissão para alterar
  return validTransitions.filter(
    (status) =>
      rolePermissions.from.includes(currentStatus) &&
      rolePermissions.to.includes(status)
  )
}

/**
 * Verifica se a role pode alterar o status atual
 */
export function canChangeStatus(
  role: Role,
  currentStatus: DemandStatus
): boolean {
  const rolePermissions = ROLE_STATUS_PERMISSIONS[role]
  return rolePermissions?.from.includes(currentStatus) || false
}

/**
 * Verifica se a transição de status é válida para a role
 */
export function canTransitionTo(
  role: Role,
  currentStatus: DemandStatus,
  newStatus: DemandStatus
): boolean {
  const availableTransitions = getAvailableStatusTransitions(role, currentStatus)
  return availableTransitions.includes(newStatus)
}

/**
 * Retorna mensagem de erro amigável para transição inválida
 */
export function getTransitionErrorMessage(
  role: Role,
  currentStatus: DemandStatus,
  newStatus: DemandStatus
): string {
  const rolePermissions = ROLE_STATUS_PERMISSIONS[role]
  
  if (!rolePermissions.from.includes(currentStatus)) {
    return `Você não tem permissão para alterar demands com status '${currentStatus}'`
  }
  
  if (!rolePermissions.to.includes(newStatus)) {
    return `Você não tem permissão para alterar status para '${newStatus}'`
  }
  
  return `Transição de status inválida: não é possível mudar de '${currentStatus}' para '${newStatus}'`
}
