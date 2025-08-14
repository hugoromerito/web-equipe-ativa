'use client'

import { translateStatus } from '@/constants/demand-translations'
import { useTransition } from 'react'
import { updateDemand } from '@/http/update-demand-status'
import { updateDemandAction, type UpdateDemandSchema } from './actions'
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

export function DrawerDemandStatus() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 font-semibold">Atualizar Status da Demanda</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-lg" />
          <div className="relative z-10">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                Atualizar Demanda
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                Dê andamento à demanda alterando seu status atual. Esta ação será registrada no histórico da demanda.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm setOpen={setOpen} />
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
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 font-semibold">Atualizar Status</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-white/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30" />
        <div className="relative z-10">
          <DrawerHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <Edit className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Atualizar Demanda
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 text-base leading-relaxed px-4">
              Dê andamento à demanda alterando seu status atual. Esta ação será registrada no histórico da demanda.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="px-6" setOpen={setOpen} />
          <DrawerFooter className="pt-6 px-6">
            <DrawerClose asChild>
              <Button 
                variant="outline" 
                className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3"
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
}: React.ComponentProps<'form'> & { setOpen?: (open: boolean) => void }) {
  const formAction = updateDemandAction

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
        <Label htmlFor="status" className="text-base font-semibold text-gray-900">
          Novo Status da Demanda
        </Label>
        <div className="relative">
          <ComboBoxStatus id="status" name="status" />
          {errors?.status && (
            <p className="text-sm font-medium text-red-600 mt-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Por favor, selecione o status da demanda
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