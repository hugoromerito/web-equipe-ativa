'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, X } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useJobTitles } from '@/hooks/use-job-titles'
import { toast } from 'sonner'

const jobTitleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
})

type JobTitleFormData = z.infer<typeof jobTitleSchema>

interface CreateJobTitleDialogProps {
  organizationSlug: string
}

export function CreateJobTitleDialog({ organizationSlug }: CreateJobTitleDialogProps) {
  const [open, setOpen] = useState(false)
  const { createJobTitle, isCreating } = useJobTitles(organizationSlug)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobTitleFormData>({
    resolver: zodResolver(jobTitleSchema),
  })

  const onSubmit = async (data: JobTitleFormData) => {
    try {
      await createJobTitle(data)
      toast.success('Cargo criado com sucesso!')
      setOpen(false)
      reset()
    } catch (error) {
      toast.error('Erro ao criar cargo. Tente novamente.')
      console.error(error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isCreating) {
      setOpen(newOpen)
      if (!newOpen) {
        reset()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cargo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Cargo</DialogTitle>
          <DialogDescription>
            Adicione um novo cargo/função para sua organização
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome do Cargo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Médico, Enfermeiro, Recepcionista..."
              {...register('name')}
              disabled={isCreating}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva as responsabilidades e atribuições deste cargo..."
              rows={4}
              {...register('description')}
              disabled={isCreating}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Cargo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
