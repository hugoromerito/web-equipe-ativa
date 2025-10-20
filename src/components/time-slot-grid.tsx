'use client'

import { useState, useMemo } from 'react'
import { Calendar, Clock, Loader2, User, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MemberAvailability } from '@/http/get-member-availability'
import { format, addDays, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TimeSlotGridProps {
  availability: MemberAvailability[]
  isLoading?: boolean
  onSlotSelect?: (memberId: string, date: string, startTime: string, endTime: string) => void
  selectedSlot?: {
    memberId: string
    date: string
    startTime: string
    endTime: string
  } | null
}

// Gera slots de 30 minutos das 8h às 18h
function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  slots.push('18:00') // Adiciona o último horário
  return slots
}

export function TimeSlotGrid({
  availability,
  isLoading = false,
  onSlotSelect,
  selectedSlot,
}: TimeSlotGridProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 0 }) // Domingo
  )
  
  // Estado para o modal de seleção de profissional
  const [memberSelectionDialog, setMemberSelectionDialog] = useState<{
    open: boolean
    members: MemberAvailability[]
    date: string
    time: string
  }>({
    open: false,
    members: [],
    date: '',
    time: '',
  })

  // Gera os 7 dias da semana atual
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  }, [currentWeekStart])

  const timeSlots = useMemo(() => generateTimeSlots(), [])

  // 🚀 OTIMIZAÇÃO: Pré-calcular disponibilidade para evitar re-cálculo em cada célula
  // Isso melhora drasticamente a performance (147 células = 147+ cálculos repetidos!)
  const availabilityMap = useMemo(() => {
    const map = new Map<string, MemberAvailability[]>()
    
    // Para cada dia da semana
    weekDays.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      
      // Para cada horário
      timeSlots.forEach((time) => {
        const key = `${dateStr}-${time}`
        
        // Filtrar membros disponíveis para este slot
        const availableMembers = availability.filter((member) =>
          member.availability.some((slot) => {
            return (
              slot.date === dateStr &&
              slot.startTime <= time &&
              slot.endTime > time &&
              slot.isAvailable
            )
          })
        )
        
        map.set(key, availableMembers)
      })
    })
    
    return map
  }, [availability, weekDays, timeSlots])

  // Navegar semanas
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  // Verifica se um slot específico está disponível (agora usa o mapa pré-calculado)
  const isSlotAvailable = (date: Date, time: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${dateStr}-${time}`
    const members = availabilityMap.get(key) || []
    return members.length > 0
  }

  // Obtém membros disponíveis para um slot específico (agora usa o mapa pré-calculado)
  const getAvailableMembers = (date: Date, time: string): MemberAvailability[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${dateStr}-${time}`
    return availabilityMap.get(key) || []
  }

  const isSlotSelected = (date: Date, time: string): boolean => {
    if (!selectedSlot) return false
    const dateStr = format(date, 'yyyy-MM-dd')
    return selectedSlot.date === dateStr && selectedSlot.startTime === time
  }

  // Função para lidar com o clique em um slot
  const handleSlotClick = (date: Date, time: string, members: MemberAvailability[]) => {
    if (!onSlotSelect || members.length === 0) return

    const dateStr = format(date, 'yyyy-MM-dd')

    // Se houver apenas 1 profissional, seleciona direto
    if (members.length === 1) {
      onSlotSelect(members[0].memberId, dateStr, time, time)
    } else {
      // Se houver mais de 1, abre o modal para escolha
      setMemberSelectionDialog({
        open: true,
        members,
        date: dateStr,
        time,
      })
    }
  }

  // Função para selecionar um profissional no modal
  const handleMemberSelect = (memberId: string) => {
    if (onSlotSelect) {
      onSlotSelect(
        memberId,
        memberSelectionDialog.date,
        memberSelectionDialog.time,
        memberSelectionDialog.time
      )
    }
    setMemberSelectionDialog({ open: false, members: [], date: '', time: '' })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Agenda de Disponibilidade</CardTitle>
              <CardDescription>
                Carregando horários disponíveis...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availability.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Agenda de Disponibilidade</CardTitle>
              <CardDescription>
                Selecione um cargo para visualizar os horários
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Nenhum profissional disponível para o cargo selecionado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Agenda de Disponibilidade</CardTitle>
              <CardDescription>
                Clique em um horário para selecionar
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousWeek}
              className="h-8 px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentWeek}
              className="h-8"
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              className="h-8 px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legenda */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-xs text-muted-foreground">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <span className="text-xs text-muted-foreground">Indisponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-xs text-muted-foreground">Selecionado</span>
          </div>
        </div>

        {/* Grid de horários */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Cabeçalho com datas */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2 text-center">
                <Clock className="w-4 h-4 mx-auto text-muted-foreground" />
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="p-2 text-center border rounded-lg bg-accent/30"
                >
                  <div className="text-xs font-medium">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {format(day, 'dd/MM')}
                  </div>
                </div>
              ))}
            </div>

            {/* Linhas de horários */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-1">
                  {/* Coluna de horário */}
                  <div className="p-2 text-center text-xs font-medium text-muted-foreground flex items-center justify-center">
                    {time}
                  </div>

                  {/* Colunas de disponibilidade */}
                  {weekDays.map((day) => {
                    const available = isSlotAvailable(day, time)
                    const selected = isSlotSelected(day, time)
                    const members = getAvailableMembers(day, time)

                    return (
                      <button
                        key={`${day.toISOString()}-${time}`}
                        onClick={() => {
                          if (available && members.length > 0) {
                            handleSlotClick(day, time, members)
                          }
                        }}
                        disabled={!available}
                        className={cn(
                          'p-2 text-center border rounded transition-all relative group',
                          available
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/30 cursor-pointer'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed',
                          selected &&
                            'bg-blue-500 border-blue-600 hover:bg-blue-600 ring-2 ring-blue-400'
                        )}
                      >
                        {available && members.length > 0 && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded flex items-center justify-center z-10 p-1">
                            <div className="text-[10px] text-white text-center">
                              {members.length === 1 ? (
                                <span>{members[0].memberName}</span>
                              ) : (
                                <span>{members.length} disponíveis</span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="text-xs">
                          {available && (
                            <Badge
                              variant="secondary"
                              className="h-4 text-[10px] px-1"
                            >
                              {members.length}
                            </Badge>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membros disponíveis */}
        {availability.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Profissionais Disponíveis
            </h4>
            <div className="flex flex-wrap gap-2">
              {availability.map((member) => (
                <Badge key={member.memberId} variant="outline" className="gap-2">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.memberName}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {member.memberName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal de Seleção de Profissional */}
      <Dialog open={memberSelectionDialog.open} onOpenChange={(open) => {
        if (!open) {
          setMemberSelectionDialog({ open: false, members: [], date: '', time: '' })
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Selecionar Profissional
            </DialogTitle>
            <DialogDescription>
              {memberSelectionDialog.members.length > 1 && (
                <>
                  {memberSelectionDialog.members.length} profissionais disponíveis para {' '}
                  {memberSelectionDialog.time} em {' '}
                  {memberSelectionDialog.date && format(new Date(memberSelectionDialog.date), "dd 'de' MMMM", { locale: ptBR })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            {memberSelectionDialog.members.map((member) => {
              const isSelected = selectedSlot?.memberId === member.memberId && 
                                selectedSlot?.date === memberSelectionDialog.date &&
                                selectedSlot?.startTime === memberSelectionDialog.time
              
              return (
                <button
                  key={member.memberId}
                  onClick={() => handleMemberSelect(member.memberId)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-slate-200 hover:border-primary/50"
                  )}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.memberName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {member.memberName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-slate-800">{member.memberName}</h4>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>

                  {/* Check Icon */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
