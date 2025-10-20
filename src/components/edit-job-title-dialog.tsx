'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Pencil, X } from 'lucide-react'

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
import type { JobTitle } from '@/http/get-job-titles'

const jobTitleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
})

type JobTitleFormData = z.infer<typeof jobTitleSchema>

interface EditJobTitleDialogProps {
  organizationSlug: string
  jobTitle: JobTitle
  children?: React.ReactNode
}

export function EditJobTitleDialog({ 
  organizationSlug, 
  jobTitle,
  children 
}: EditJobTitleDialogProps) {
  const [open, setOpen] = useState(false)
  const { updateJobTitle, isUpdating } = useJobTitles(organizationSlug)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobTitleFormData>({
    resolver: zodResolver(jobTitleSchema),
    defaultValues: {
      name: jobTitle.name,
      description: jobTitle.description || '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: jobTitle.name,
        description: jobTitle.description || '',
      })
    }
  }, [open, jobTitle, reset])

  const onSubmit = async (data: JobTitleFormData) => {
    try {
      await updateJobTitle({
        jobTitleId: jobTitle.id,
        data,
      })
      toast.success('Cargo atualizado com sucesso!')
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao atualizar cargo. Tente novamente.')
      console.error(error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isUpdating) {
      setOpen(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cargo</DialogTitle>
          <DialogDescription>
            Atualize as informações do cargo/função
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nome do Cargo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ex: Médico, Enfermeiro, Recepcionista..."
              {...register('name')}
              disabled={isUpdating}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição (opcional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Descreva as responsabilidades e atribuições deste cargo..."
              rows={4}
              {...register('description')}
              disabled={isUpdating}
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
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
