'use client'

import { translateStatus } from '@/constants/demand-translations'
import { useTransition } from 'react'
import { updateDemand } from '@/http/update-demand'
import { updateConsultaction, type UpdateDemandSchema } from './actions'
import { useFormState } from '@/hooks/use-form-state'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2, CheckCircle, ArrowRight, Edit } from 'lucide-react'
import { ComboBoxStatus } from '@/components/switches/status-switcher'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { DemandStatus } from '@/lib/auth/demand-status'
import type { DemandStatusType } from '@/constants/demand-translations'

type StatusOption = {
  value: DemandStatus
  label: string
}

export const statusOptions: StatusOption[] = [
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvida' },
  { value: 'REJECTED', label: 'Rejeitada' },
]

interface DemandStatusControlProps {
  currentStatus: DemandStatus
  organizationSlug: string
  unitSlug: string
  demandSlug: string
}

interface DemandFormProps {
  initialData?: UpdateDemandSchema
}

interface DrawerDemandStatusProps {
  currentStatus?: DemandStatusType
}

export function DrawerDemandStatus({ currentStatus }: DrawerDemandStatusProps = {}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="group medical-button medical-button-primary medical-hover-lift px-8 py-3"
            >
              <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 font-semibold">Atualizar Status da Consulta</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] medical-card-elevated medical-glass">
          <div className="absolute inset-0 medical-gradient-primary rounded-lg opacity-10" />
          <div className="relative z-10">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold medical-text-gradient flex items-center gap-3">
                <div className="medical-icon-container bg-primary/10 text-primary">
                  <Edit className="h-6 w-6" />
                </div>
                Atualizar Consulta
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                Dê andamento à consulta alterando seu status atual. Esta ação será registrada no histórico da consulta.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm currentStatus={currentStatus} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex justify-center px-4">
          <Button 
            size="lg" 
            className="group medical-button medical-button-primary medical-hover-lift px-6 py-3 w-full max-w-md"
          >
            <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 font-semibold">Atualizar Status</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="medical-card medical-glass">
        <div className="absolute inset-0 medical-gradient-primary opacity-10" />
        <div className="relative z-10">
          <DrawerHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="medical-icon-container bg-primary/10 text-primary p-3">
                <Edit className="h-8 w-8" />
              </div>
            </div>
            <DrawerTitle className="text-2xl font-bold medical-text-gradient">
              Atualizar Consulta
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-base leading-relaxed px-4">
              Dê andamento à consulta alterando seu status atual. Esta ação será registrada no histórico da consulta.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm currentStatus={currentStatus} className="px-6" setOpen={setOpen} />
          <DrawerFooter className="pt-6 px-6">
            <DrawerClose asChild>
              <Button 
                variant="outline" 
                className="medical-button medical-button-outline py-3"
              >
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({
  className,
  setOpen,
  currentStatus,
}: React.ComponentProps<'form'> & { 
  setOpen?: (open: boolean) => void
  currentStatus?: DemandStatusType
}) {
  const formAction = updateConsultaction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  // Fecha o Drawer ao ter sucesso
  React.useEffect(() => {
    if (success && setOpen) {
      setOpen(false)
    }
  }, [success, setOpen])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
    >
      {success === false && message && (
        <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold text-red-800">Erro ao atualizar</AlertTitle>
          <AlertDescription className="text-red-700">
            {message}
          </AlertDescription>
        </Alert>
      )}
      
      {success === true && message && (
        <Alert className="border-green-200 bg-green-50/80 backdrop-blur-sm text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="font-semibold text-green-800">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Label htmlFor="status" className="text-base font-semibold text-foreground">
          Novo Status da Consulta
        </Label>
        <div className="relative">
          <ComboBoxStatus id="status" name="status" currentStatus={currentStatus} />
          {errors?.status && (
            <p className="text-sm font-medium text-red-600 mt-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Por favor, selecione o status da consulta
            </p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className={cn(
          "w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
          isPending && "opacity-70 cursor-not-allowed transform-none"
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Atualizando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Salvar Atualização</span>
            </>
          )}
        </div>
      </Button>
    </form>
  )
}