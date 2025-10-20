import { useQuery } from '@tanstack/react-query'
import { getMemberAvailability, type MemberAvailability } from '@/http/get-member-availability'
import { format, addDays, startOfWeek } from 'date-fns'

interface UseAvailabilityParams {
  organizationSlug: string
  unitSlug: string
  jobTitleId: string | null
  enabled?: boolean
}

// Dados mockados para visualização
function generateMockAvailability(): { members: MemberAvailability[] } {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })
  
  const mockMembers: MemberAvailability[] = [
    {
      memberId: 'member-1',
      memberName: 'Dr. João Silva',
      avatarUrl: null,
      email: 'joao.silva@email.com',
      availability: [],
    },
    {
      memberId: 'member-2',
      memberName: 'Dra. Maria Santos',
      avatarUrl: null,
      email: 'maria.santos@email.com',
      availability: [],
    },
    {
      memberId: 'member-3',
      memberName: 'Dr. Pedro Costa',
      avatarUrl: null,
      email: 'pedro.costa@email.com',
      availability: [],
    },
  ]

  // Gerar slots de disponibilidade para os próximos 7 dias
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = addDays(weekStart, dayOffset)
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    
    // Cada membro tem diferentes disponibilidades
    mockMembers.forEach((member, memberIndex) => {
      // Gerar horários das 8h às 18h em intervalos de 30min
      for (let hour = 8; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          const endTime = minute === 30 
            ? `${(hour + 1).toString().padStart(2, '0')}:00`
            : `${hour.toString().padStart(2, '0')}:30`
          
          // Criar padrões diferentes de disponibilidade para cada membro
          // Member 1: disponível de manhã (8h-12h) em dias úteis
          // Member 2: disponível à tarde (14h-18h) todos os dias
          // Member 3: disponível o dia todo em dias alternados
          
          let isAvailable = false
          
          if (memberIndex === 0) {
            // Dr. João - manhãs de seg a sex
            isAvailable = dayOffset >= 1 && dayOffset <= 5 && hour >= 8 && hour < 12
          } else if (memberIndex === 1) {
            // Dra. Maria - tardes todos os dias
            isAvailable = hour >= 14 && hour < 18
          } else if (memberIndex === 2) {
            // Dr. Pedro - dias alternados (ter, qui, sab)
            isAvailable = (dayOffset === 2 || dayOffset === 4 || dayOffset === 6)
          }
          
          member.availability.push({
            memberId: member.memberId,
            memberName: member.memberName,
            date: dateStr,
            startTime,
            endTime,
            isAvailable,
          })
        }
      }
    })
  }

  return { members: mockMembers }
}

export function useAvailability({
  organizationSlug,
  unitSlug,
  jobTitleId,
  enabled = true,
}: UseAvailabilityParams) {
  // Busca disponibilidade para a semana atual e próximas 2 semanas
  const startDate = format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')
  const endDate = format(addDays(new Date(), 21), 'yyyy-MM-dd')

  // 🎉 PRODUÇÃO: Usando nova API /availability-schedule (SUPER RÁPIDA!)
  // ✅ Apenas 1 requisição HTTP ao invés de 147!
  return useQuery({
    queryKey: ['member-availability', organizationSlug, unitSlug, jobTitleId, startDate, endDate],
    queryFn: async () => {
      try {
        return await getMemberAvailability({
          organizationSlug,
          unitSlug,
          jobTitleId: jobTitleId!,
          startDate,
          endDate,
        })
      } catch (error) {
        console.error('Erro ao buscar disponibilidade:', error)
        // Em caso de erro, retornar estrutura vazia
        return { members: [] }
      }
    },
    enabled: enabled && !!jobTitleId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2, // Pode aumentar retry pois agora é apenas 1 chamada
  })

  // DESENVOLVIMENTO: Descomentar para usar dados mockados
  /*
  return useQuery({
    queryKey: ['member-availability', organizationSlug, unitSlug, jobTitleId, startDate, endDate],
    queryFn: async () => {
      console.warn('⚠️ Usando dados mockados - Endpoint /members/availability ainda não implementado no backend')
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      return generateMockAvailability()
    },
    enabled: enabled && !!jobTitleId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
  */
}
