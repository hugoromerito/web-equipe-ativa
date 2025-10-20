'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, UserPlus, X, Briefcase } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useJobTitles } from '@/hooks/use-job-titles'
import { assignJobTitleToMember } from '@/http/assign-job-title'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const WEEK_DAYS = [
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
]

const assignJobTitleSchema = z.object({
  jobTitleId: z.string().min(1, 'Selecione um cargo'),
  workDays: z.array(z.string()).min(1, 'Selecione pelo menos um dia'),
})

type AssignJobTitleFormData = z.infer<typeof assignJobTitleSchema>

interface AssignJobTitleDialogProps {
  organizationSlug: string
  memberId: string
  memberName: string
  children?: React.ReactNode
}

export function AssignJobTitleDialog({ 
  organizationSlug, 
  memberId,
  memberName,
  children 
}: AssignJobTitleDialogProps) {
  const [open, setOpen] = useState(false)
  const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(organizationSlug)
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const queryClient = useQueryClient()

  const assignMutation = useMutation({
    mutationFn: async (data: AssignJobTitleFormData) => {
      await assignJobTitleToMember(organizationSlug, memberId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['members', organizationSlug] 
      })
      toast.success('Cargo atribuído com sucesso!')
      setOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      
      // Mensagens específicas baseadas no erro
      if (error.response?.status === 404) {
        toast.error('Endpoint não encontrado. Verifique se a API está implementada.')
      } else if (error.response?.status === 401) {
        toast.error('Não autorizado. Faça login novamente.')
      } else if (error.response?.status === 400) {
        toast.error('Dados inválidos. Verifique os campos.')
      } else {
        toast.error(`Erro ao atribuir cargo: ${error.message || 'Tente novamente.'}`)
      }
    },
  })

  const resetForm = () => {
    setSelectedJobTitle('')
    setSelectedDays([])
  }

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedJobTitle) {
      toast.error('Selecione um cargo')
      return
    }
    
    if (selectedDays.length === 0) {
      toast.error('Selecione pelo menos um dia de trabalho')
      return
    }

    assignMutation.mutate({
      jobTitleId: selectedJobTitle,
      workDays: selectedDays,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!assignMutation.isPending) {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Briefcase className="h-4 w-4 mr-2" />
            Atribuir Cargo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atribuir Cargo ao Membro</DialogTitle>
          <DialogDescription>
            Atribua um cargo e os dias de trabalho para <strong>{memberName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title Select */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedJobTitle}
              onValueChange={setSelectedJobTitle}
              disabled={isLoadingJobTitles || assignMutation.isPending}
            >
              <SelectTrigger id="jobTitle">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {jobTitles.map((jobTitle) => (
                  <SelectItem key={jobTitle.id} value={jobTitle.id}>
                    {jobTitle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {jobTitles.length === 0 && !isLoadingJobTitles && (
              <p className="text-sm text-amber-600">
                Nenhum cargo cadastrado. Crie cargos primeiro.
              </p>
            )}
          </div>

          {/* Work Days */}
          <div className="space-y-3">
            <Label>
              Dias de Trabalho <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {WEEK_DAYS.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.value}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                    disabled={assignMutation.isPending}
                  />
                  <Label
                    htmlFor={day.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedDays.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedDays.length} {selectedDays.length === 1 ? 'dia selecionado' : 'dias selecionados'}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={assignMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={assignMutation.isPending}>
              {assignMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Atribuir Cargo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
