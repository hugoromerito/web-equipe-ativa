'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const WEEK_DAYS = [
  { value: 'monday', label: 'Segunda-feira', short: 'Seg', api: 'SEGUNDA' },
  { value: 'tuesday', label: 'Terça-feira', short: 'Ter', api: 'TERCA' },
  { value: 'wednesday', label: 'Quarta-feira', short: 'Qua', api: 'QUARTA' },
  { value: 'thursday', label: 'Quinta-feira', short: 'Qui', api: 'QUINTA' },
  { value: 'friday', label: 'Sexta-feira', short: 'Sex', api: 'SEXTA' },
  { value: 'saturday', label: 'Sábado', short: 'Sáb', api: 'SABADO' },
  { value: 'sunday', label: 'Domingo', short: 'Dom', api: 'DOMINGO' },
] as const

interface WeekDaysSelectorProps {
  selectedDays: string[]
  onDaysChange: (days: string[]) => void
  disabled?: boolean
  variant?: 'default' | 'compact'
  showCard?: boolean
}

export function WeekDaysSelector({
  selectedDays,
  onDaysChange,
  disabled = false,
  variant = 'default',
  showCard = false,
}: WeekDaysSelectorProps) {
  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day]
    onDaysChange(newDays)
  }

  const handleSelectAll = () => {
    if (selectedDays.length === WEEK_DAYS.length) {
      onDaysChange([])
    } else {
      onDaysChange(WEEK_DAYS.map((d) => d.value))
    }
  }

  const handleSelectWeekdays = () => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    onDaysChange(weekdays)
  }

  const handleSelectWeekend = () => {
    const weekend = ['saturday', 'sunday']
    onDaysChange(weekend)
  }

  const content = (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedDays.length === WEEK_DAYS.length ? 'Desmarcar Todos' : 'Todos'}
        </button>
        <button
          type="button"
          onClick={handleSelectWeekdays}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dias Úteis
        </button>
        <button
          type="button"
          onClick={handleSelectWeekend}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Fim de Semana
        </button>
      </div>

      {/* Days List */}
      <div className={variant === 'compact' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {WEEK_DAYS.map((day) => (
          <div key={day.value} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${day.value}`}
              checked={selectedDays.includes(day.value)}
              onCheckedChange={() => handleDayToggle(day.value)}
              disabled={disabled}
            />
            <Label
              htmlFor={`day-${day.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {variant === 'compact' ? day.short : day.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Summary */}
      {selectedDays.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedDays.length} {selectedDays.length === 1 ? 'dia selecionado' : 'dias selecionados'}
        </p>
      )}
    </div>
  )

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dias de Trabalho</CardTitle>
          <CardDescription>
            Selecione os dias da semana em que o membro trabalhará
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    )
  }

  return content
}
