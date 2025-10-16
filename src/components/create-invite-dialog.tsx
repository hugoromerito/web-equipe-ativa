'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateInvite } from '@/hooks/use-invites'
import { ROLE_OPTIONS } from '@/constants/role-translations'
import { useState } from 'react'

const createInviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um cargo'),
  unitSlug: z.string().optional(),
})

type CreateInviteFormData = z.infer<typeof createInviteSchema>

interface CreateInviteDialogProps {
  organizationSlug: string
  onSuccess?: () => void
}

export function CreateInviteDialog({
  organizationSlug,
  onSuccess,
}: CreateInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: createInvite, isPending } = useCreateInvite()

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: '',
      role: '',
      unitSlug: '',
    },
  })

  async function onSubmit(data: CreateInviteFormData) {
    try {
      await createInvite({
        organizationSlug,
        ...data,
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao criar convite:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Enviar Convite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Convite</DialogTitle>
          <DialogDescription>
            Envie um convite para adicionar um novo membro à organização.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="novo@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug da unidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
