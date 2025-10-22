'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus, Mail } from 'lucide-react'
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
import { testAuth } from '@/utils/test-auth'

const createInviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um cargo'),
  unitSlug: z.string().optional(),
})

type CreateInviteFormData = z.infer<typeof createInviteSchema>

interface CreateInviteDialogProps {
  organizationSlug: string
  unitSlug?: string
  onSuccess?: () => void
}

export function CreateInviteDialog({
  organizationSlug,
  unitSlug,
  onSuccess,
}: CreateInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: createInvite, isPending } = useCreateInvite()
  
  console.log('🔧 CreateInviteDialog props:', { organizationSlug, unitSlug })

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: '',
      role: '',
      unitSlug: unitSlug || '',
    },
  })

  async function onSubmit(data: CreateInviteFormData) {
    try {
      console.log('📤 Enviando dados do convite:', {
        organizationSlug,
        ...data,
      })
      
      // Debug de autenticação
      testAuth()
      
      await createInvite({
        organizationSlug,
        ...data,
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('❌ Erro ao criar convite:', error)
      
      // Mostrar erro para o usuário
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar convite'
      
      // Você pode implementar um toast aqui ou usar outro método para mostrar erro
      alert(errorMessage) // Temporário para debug
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-medical-primary inline-flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          Convidar Membro
        </Button>
      </DialogTrigger>
      <DialogContent className="medical-modal-content">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Convidar Novo Membro
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Envie um convite por email para adicionar um novo membro à sua equipe médica.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="medical-form-group">
                  <FormLabel className="medical-form-label">Email do Profissional</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="profissional@hospital.com"
                      className="medical-form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="medical-form-error" />
                  <p className="medical-form-help">
                    Insira o email do profissional que deseja convidar para a equipe
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="medical-form-group">
                  <FormLabel className="medical-form-label">Cargo na Equipe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="medical-form-input">
                        <SelectValue placeholder="Selecione o cargo do profissional" />
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
                  <FormMessage className="medical-form-error" />
                  <p className="medical-form-help">
                    Defina o nível de acesso e responsabilidades do novo membro
                  </p>
                </FormItem>
              )}
            />

            {!unitSlug && (
              <FormField
                control={form.control}
                name="unitSlug"
                render={({ field }) => (
                  <FormItem className="medical-form-group">
                    <FormLabel className="medical-form-label">Unidade Específico (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: uti, emergencia, cardiologia" 
                        className="medical-form-input"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="medical-form-error" />
                    <p className="medical-form-help">
                      Deixe em branco para acesso geral ou especifique a unidade
                    </p>
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="btn-medical-secondary"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="btn-medical-primary"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando convite...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
