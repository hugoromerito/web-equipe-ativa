/**
 * Constantes e utilitários para dias da semana
 * A API espera os dias em PORTUGUÊS e MAIÚSCULAS
 */

// Tipo para os dias da semana aceitos pela API
export type ApiWeekDay = 
  | 'DOMINGO' 
  | 'SEGUNDA' 
  | 'TERCA' 
  | 'QUARTA' 
  | 'QUINTA' 
  | 'SEXTA' 
  | 'SABADO'

// Tipo para os dias da semana no frontend (inglês lowercase)
export type FrontendWeekDay = 
  | 'sunday'
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday'

// Mapa de conversão: Frontend (inglês) -> API (português maiúsculas)
export const DAYS_TO_API: Record<FrontendWeekDay, ApiWeekDay> = {
  sunday: 'DOMINGO',
  monday: 'SEGUNDA',
  tuesday: 'TERCA',
  wednesday: 'QUARTA',
  thursday: 'QUINTA',
  friday: 'SEXTA',
  saturday: 'SABADO',
}

// Mapa de conversão: API (português maiúsculas) -> Frontend (inglês)
export const DAYS_FROM_API: Record<ApiWeekDay, FrontendWeekDay> = {
  DOMINGO: 'sunday',
  SEGUNDA: 'monday',
  TERCA: 'tuesday',
  QUARTA: 'wednesday',
  QUINTA: 'thursday',
  SEXTA: 'friday',
  SABADO: 'saturday',
}

// Labels em português para display
export const DAY_LABELS: Record<FrontendWeekDay, string> = {
  sunday: 'Domingo',
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
}

// Labels abreviados
export const DAY_LABELS_SHORT: Record<FrontendWeekDay, string> = {
  sunday: 'Dom',
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
}

/**
 * Converte dias do frontend (inglês) para formato da API (português maiúsculas)
 */
export function convertDaysToApi(frontendDays: string[]): ApiWeekDay[] {
  return frontendDays.map(day => {
    const lowerDay = day.toLowerCase() as FrontendWeekDay
    return DAYS_TO_API[lowerDay] || day.toUpperCase() as ApiWeekDay
  })
}

/**
 * Converte dias da API (português maiúsculas) para formato do frontend (inglês)
 */
export function convertDaysFromApi(apiDays: string[]): FrontendWeekDay[] {
  return apiDays.map(day => {
    const upperDay = day.toUpperCase() as ApiWeekDay
    return DAYS_FROM_API[upperDay] || day.toLowerCase() as FrontendWeekDay
  })
}

/**
 * Retorna todos os dias da semana em ordem (segunda a domingo)
 */
export const ALL_WEEK_DAYS: FrontendWeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

/**
 * Retorna dias úteis (segunda a sexta)
 */
export const WEEKDAYS: FrontendWeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
]

/**
 * Retorna final de semana (sábado e domingo)
 */
export const WEEKEND: FrontendWeekDay[] = [
  'saturday',
  'sunday',
]
