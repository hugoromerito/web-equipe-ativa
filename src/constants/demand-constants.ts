export const DEMAND_PRIORITIES = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
} as const

export const DEMAND_STATUSES = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em Progresso',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
  CANCELED: 'Cancelado',
} as const

export const DEMAND_CATEGORIES = {
  SOCIAL_ASSISTANCE: 'Assistência Social',
  HEALTH: 'Saúde',
  EDUCATION: 'Educação',
  INFRASTRUCTURE: 'Infraestrutura',
  SECURITY: 'Segurança',
  TRANSPORTATION: 'Transporte',
  HOUSING: 'Habitação',
  EMPLOYMENT: 'Emprego',
  ENVIRONMENT: 'Meio Ambiente',
  CULTURE: 'Cultura',
  SPORTS: 'Esporte',
  OTHER: 'Outro',
} as const

export type DemandPriority = keyof typeof DEMAND_PRIORITIES
export type DemandStatus = keyof typeof DEMAND_STATUSES
export type DemandCategory = keyof typeof DEMAND_CATEGORIES

export function translateDemandPriority(priority: DemandPriority): string {
  return DEMAND_PRIORITIES[priority] || priority
}

export function translateDemandStatus(status: DemandStatus): string {
  return DEMAND_STATUSES[status] || status
}

export function translateDemandCategory(category: DemandCategory): string {
  return DEMAND_CATEGORIES[category] || category
}
