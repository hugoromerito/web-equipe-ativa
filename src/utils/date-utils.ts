/**
 * Utilitários para manipulação de datas sem problemas de timezone
 */

/**
 * Converte uma data no formato "YYYY-MM-DD" para Date sem problemas de timezone
 * 
 * @param dateString - Data no formato "YYYY-MM-DD" do banco de dados
 * @returns Date object representando a data local (não UTC)
 * 
 * @example
 * parseLocalDate("2025-10-20") // 2025-10-20 00:00:00 (local time)
 * 
 * Problema resolvido:
 * - new Date("2025-10-20") → interpreta como UTC → vira 2025-10-19 no BR (GMT-3)
 * - parseLocalDate("2025-10-20") → interpreta como local → mantém 2025-10-20
 */
export function parseLocalDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null
  
  // Remove time se vier junto (ex: "2025-10-20T00:00:00")
  const cleanDate = dateString.split('T')[0]
  
  // Parse manual: "YYYY-MM-DD" → [year, month, day]
  const [year, month, day] = cleanDate.split('-').map(Number)
  
  // Cria Date com timezone local (não UTC)
  // Nota: month é 0-indexed (0 = Janeiro)
  return new Date(year, month - 1, day)
}

/**
 * Formata uma data para exibição no padrão brasileiro
 * 
 * @param date - String de data ou Date object
 * @param options - Opções de formatação (padrão: dd/MM/yyyy)
 * @returns String formatada ou null
 * 
 * @example
 * formatLocalDate("2025-10-20") // "20/10/2025"
 * formatLocalDate("2025-10-20", { weekday: 'short' }) // "dom, 20/10/2025"
 */
export function formatLocalDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string | null {
  if (!date) return null
  
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  if (!dateObj) return null
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }
  
  return dateObj.toLocaleDateString('pt-BR', defaultOptions)
}

/**
 * Formata hora no formato HH:MM
 * 
 * @param timeString - Hora no formato "HH:MM:SS" ou "HH:MM"
 * @returns String formatada "HH:MM"
 * 
 * @example
 * formatTime("08:30:00") // "08:30"
 * formatTime("13:00:00") // "13:00"
 */
export function formatTime(timeString: string | null | undefined): string | null {
  if (!timeString) return null
  
  // Pega apenas HH:MM (remove segundos se existir)
  return timeString.substring(0, 5)
}

/**
 * Formata data e hora juntos
 * 
 * @param date - String de data "YYYY-MM-DD"
 * @param time - String de hora "HH:MM:SS"
 * @returns String formatada "dd/MM/yyyy às HH:MM"
 * 
 * @example
 * formatDateTime("2025-10-20", "08:30:00") // "20/10/2025 às 08:30"
 */
export function formatDateTime(
  date: string | null | undefined,
  time: string | null | undefined
): string | null {
  if (!date) return null
  
  const formattedDate = formatLocalDate(date)
  if (!formattedDate) return null
  
  if (!time) return formattedDate
  
  const formattedTime = formatTime(time)
  return `${formattedDate} às ${formattedTime}`
}

/**
 * Formata um timestamp ISO completo para data e hora no horário de Brasília
 * 
 * @param timestamp - String ISO 8601 ou Date object (ex: "2025-10-20T00:00:11.733423Z")
 * @param options - Opções de formatação
 * @returns String formatada "dd/MM/yyyy às HH:MM" ou null
 * 
 * @example
 * formatTimestamp("2025-10-20T00:00:11.733423Z") // "20/10/2025 às 21:00" (GMT-3)
 * formatTimestamp("2025-10-20 00:00:11.733423") // "20/10/2025 às 21:00"
 */
export function formatTimestamp(
  timestamp: string | Date | null | undefined,
  options?: {
    includeSeconds?: boolean
    dateOnly?: boolean
    timeOnly?: boolean
  }
): string | null {
  if (!timestamp) return null
  
  try {
    // Converte para Date object
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp)
      return null
    }
    
    // Formata apenas a data
    if (options?.dateOnly) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo'
      })
    }
    
    // Formata apenas a hora
    if (options?.timeOnly) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        ...(options.includeSeconds ? { second: '2-digit' } : {}),
        timeZone: 'America/Sao_Paulo'
      })
    }
    
    // Formata data + hora (padrão)
    const dateStr = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    })
    
    const timeStr = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      ...(options?.includeSeconds ? { second: '2-digit' } : {}),
      timeZone: 'America/Sao_Paulo'
    })
    
    return `${dateStr} às ${timeStr}`
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp)
    return null
  }
}

/**
 * Formata timestamp de forma compacta (sem "às")
 * 
 * @param timestamp - String ISO 8601 ou Date object
 * @returns String formatada "dd/MM/yyyy HH:MM" ou null
 * 
 * @example
 * formatTimestampCompact("2025-10-20T00:00:11Z") // "20/10/2025 21:00"
 */
export function formatTimestampCompact(
  timestamp: string | Date | null | undefined
): string | null {
  if (!timestamp) return null
  
  const formatted = formatTimestamp(timestamp)
  if (!formatted) return null
  
  // Remove o "às" para formato compacto
  return formatted.replace(' às ', ' ')
}

/**
 * Verifica se uma data é hoje
 */
export function isToday(date: string | Date | null | undefined): boolean {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  if (!dateObj) return false
  
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Verifica se uma data é no passado
 */
export function isPast(date: string | Date | null | undefined): boolean {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  if (!dateObj) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time para comparar apenas datas
  
  return dateObj < today
}

/**
 * Verifica se uma data é no futuro
 */
export function isFuture(date: string | Date | null | undefined): boolean {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  if (!dateObj) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return dateObj > today
}
