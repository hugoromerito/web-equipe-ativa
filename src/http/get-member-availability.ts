import { api } from './api-client'
import { format } from 'date-fns'

// ============================================
// 🆕 TIPOS PARA O NOVO ENDPOINT: /availability-schedule
// ============================================

export interface SlotAvailability {
  available: boolean
  reason: 'available' | 'conflict' | 'not-working-day' | 'outside-hours'
  conflictingDemandId?: string // Se reason === 'conflict'
}

export interface MemberSchedule {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  jobTitle?: string
  jobTitleId?: string
  workingDays?: string[]
  availability: {
    [date: string]: {
      [time: string]: SlotAvailability
    }
  }
}

export interface GetAvailabilityScheduleResponse {
  schedule: {
    dates: string[] // ['2025-10-20', '2025-10-21', ...]
    timeSlots: string[] // ['08:00', '08:30', '09:00', ...]
    members: MemberSchedule[]
  }
}

// ============================================
// TIPOS LEGADOS (para endpoint antigo /members/available)
// ============================================

export interface AvailableMember {
  id: string
  userId: string
  organizationRole: string
  jobTitleId: string | null
  workingDays: string[] // ['SEGUNDA', 'TERCA', ...]
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export interface GetAvailableMembersResponse {
  members: AvailableMember[]
}

interface GetAvailableMembersRequest {
  organizationSlug: string
  unitSlug: string
  date: string // yyyy-MM-dd
  time: string // HH:mm
  jobTitleId?: string // Opcional: filtrar por cargo
}

// ============================================
// FUNÇÃO PRINCIPAL: USA O ENDPOINT CORRETO
// ============================================

export async function getAvailableMembers({
  organizationSlug,
  unitSlug,
  date,
  time,
  jobTitleId,
}: GetAvailableMembersRequest): Promise<GetAvailableMembersResponse> {
  const searchParams: Record<string, string> = {
    date,
    time,
  }

  // ⚠️ REMOVIDO TEMPORARIAMENTE: Filtro por cargo causa erro 400
  // O backend pode não aceitar este parâmetro ou esperar outro formato
  // if (jobTitleId) {
  //   searchParams.category = jobTitleId
  // }

  try {
    console.log(`🔍 GET /members/available?date=${date}&time=${time}`)
    
    const result = await api
      .get(
        `organizations/${organizationSlug}/units/${unitSlug}/members/available`,
        { searchParams }
      )
      .json<GetAvailableMembersResponse>()

    console.log(`✅ Resposta: ${result.members?.length || 0} membros disponíveis`)
    
    // Filtrar membros pelo jobTitleId no frontend (temporário)
    if (jobTitleId && result.members) {
      const filtered = result.members.filter(
        (member) => member.jobTitleId === jobTitleId
      )
      console.log(`🔽 Filtrado para cargo ${jobTitleId}: ${filtered.length} membros`)
      return { members: filtered }
    }

    return result
  } catch (error: any) {
    console.error('❌ Erro ao buscar membros disponíveis:', {
      endpoint: `organizations/${organizationSlug}/units/${unitSlug}/members/available`,
      params: searchParams,
      error: error.message,
      status: error.response?.status,
      body: await error.response?.text?.().catch(() => 'N/A'),
    })
    throw error
  }
}

// ============================================
// TIPOS LEGADOS (para compatibilidade)
// ============================================

export interface TimeSlot {
  memberId: string
  memberName: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface MemberAvailability {
  memberId: string
  memberName: string
  avatarUrl: string | null
  email: string
  availability: TimeSlot[]
}

export interface GetMemberAvailabilityResponse {
  members: MemberAvailability[]
}

// ============================================
// 🎉 NOVA FUNÇÃO: Usa o endpoint /availability-schedule
// ============================================

interface GetAvailabilityScheduleParams {
  organizationSlug: string
  unitSlug: string
  jobTitleId?: string | null
  startDate?: string // 'YYYY-MM-DD' (padrão: hoje)
  days?: number // 1-30 (padrão: 7)
  startHour?: number // 0-23 (padrão: 8)
  endHour?: number // 0-23 (padrão: 18)
  intervalMinutes?: number // (padrão: 30)
}

export async function getAvailabilitySchedule({
  organizationSlug,
  unitSlug,
  jobTitleId,
  startDate,
  days = 7,
  startHour = 8,
  endHour = 18,
  intervalMinutes = 30,
}: GetAvailabilityScheduleParams): Promise<GetAvailabilityScheduleResponse> {
  console.log('🎉 getAvailabilitySchedule - NOVA API OTIMIZADA!')
  console.log('� Período:', days, 'dias a partir de', startDate || 'hoje')
  console.log('🎯 JobTitleId:', jobTitleId || 'todos')
  console.log('⏰ Horário:', `${startHour}h-${endHour}h (intervalos de ${intervalMinutes}min)`)

  const searchParams: Record<string, string> = {}
  
  if (startDate) searchParams.startDate = startDate
  if (days) searchParams.days = days.toString()
  if (startHour !== 8) searchParams.startHour = startHour.toString()
  if (endHour !== 18) searchParams.endHour = endHour.toString()
  if (intervalMinutes !== 30) searchParams.intervalMinutes = intervalMinutes.toString()
  if (jobTitleId) searchParams.jobTitleId = jobTitleId

  console.log('🔍 GET /members/availability-schedule')
  console.log('   Params:', searchParams)

  try {
    const result = await api
      .get(`organizations/${organizationSlug}/units/${unitSlug}/members/availability-schedule`, {
        searchParams,
      })
      .json<GetAvailabilityScheduleResponse>()

    console.log('✅ Resposta recebida com sucesso!')
    console.log('  📅 Datas:', result.schedule.dates.length)
    console.log('  ⏰ Horários:', result.schedule.timeSlots.length)
    console.log('  👥 Membros:', result.schedule.members.length)
    console.log('  📊 Total de slots:', result.schedule.dates.length * result.schedule.timeSlots.length)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao buscar grade de disponibilidade:')
    console.error('  Endpoint:', `/members/availability-schedule`)
    console.error('  Params:', searchParams)
    console.error('  Erro:', error.message)
    
    if (error.response) {
      const status = error.response.status
      const body = await error.response.text().catch(() => 'N/A')
      console.error('  Status:', status)
      console.error('  Body:', body)
    }
    
    throw error
  }
}

// ============================================
// CONVERSÃO: Nova API → Formato legado
// ============================================

function convertScheduleToAvailability(
  scheduleResponse: GetAvailabilityScheduleResponse
): GetMemberAvailabilityResponse {
  console.log('🔄 Convertendo resposta da nova API...')
  
  const members: MemberAvailability[] = scheduleResponse.schedule.members.map((member) => {
    const availability: TimeSlot[] = []
    
    // Iterar sobre todas as datas e horários
    scheduleResponse.schedule.dates.forEach((date) => {
      scheduleResponse.schedule.timeSlots.forEach((time) => {
        const slot = member.availability[date]?.[time]
        
        if (slot) {
          // ✅ Usar slot.available para determinar se está disponível
          // A API já marca conflitos como available: false
          availability.push({
            memberId: member.id,
            memberName: member.name,
            date,
            startTime: time,
            endTime: addMinutes(time, 30),
            isAvailable: slot.available,
          })
        }
      })
    })
    
    return {
      memberId: member.id,
      memberName: member.name,
      avatarUrl: member.avatarUrl || null,
      email: member.email,
      availability,
    }
  })
  
  console.log(`✅ ${members.length} membros processados`)
  
  return { members }
}

// ============================================
// FUNÇÃO PRINCIPAL ATUALIZADA: Usa nova API 🚀
// ============================================

export async function getMemberAvailability({
  organizationSlug,
  unitSlug,
  jobTitleId,
  startDate,
  endDate,
}: {
  organizationSlug: string
  unitSlug: string
  jobTitleId: string
  startDate: string
  endDate: string
}): Promise<GetMemberAvailabilityResponse> {
  console.log('🚀 getMemberAvailability - USANDO NOVA API!')
  console.log('📅 Período:', startDate, '→', endDate)
  console.log('🎯 JobTitleId:', jobTitleId)

  // Calcular número de dias
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  console.log(`📊 Total: ${days} dias`)
  console.log('⚡ Fazendo apenas 1 requisição HTTP (antes eram 147!)') 

  try {
    // ✅ Usar nova API que retorna tudo de uma vez!
    const scheduleResponse = await getAvailabilitySchedule({
      organizationSlug,
      unitSlug,
      jobTitleId,
      startDate,
      days,
      startHour: 8,
      endHour: 18,
      intervalMinutes: 30,
    })

    // Converter para formato legado (compatibilidade)
    return convertScheduleToAvailability(scheduleResponse)
  } catch (error) {
    console.error('❌ Erro ao buscar disponibilidade:', error)
    throw error
  }
}

// ============================================
// UTILITÁRIOS
// ============================================

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}
