'use client'

import React, { useState } from 'react'
import { Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { updateDemand } from '@/http/update-demand'
import { translateStatus, type DemandStatusType } from '@/constants/demand-translations'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface QuickStatusActionsProps {
  demandId: string
  currentStatus: DemandStatusType
  applicantName: string
  organizationSlug: string
  unitSlug: string
  onStatusChange?: () => void
  hasOtherInProgress?: boolean
}

export function QuickStatusActions({
  demandId,
  currentStatus,
  applicantName,
  organizationSlug,
  unitSlug,
  onStatusChange,
  hasOtherInProgress = false
}: QuickStatusActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    status: DemandStatusType
    label: string
    description: string
  } | null>(null)

  const handleStatusChange = async (newStatus: DemandStatusType) => {
    setIsLoading(true)
    try {
      // Enviar apenas o status, sem campos undefined
      const payload: any = {
        organizationSlug,
        unitSlug,
        demandId,
        status: newStatus,
      }

      await updateDemand(payload)

      const statusLabel = translateStatus(newStatus).label
      toast.success(`Status atualizado para "${statusLabel}"`, {
        description: `Demanda de ${applicantName} atualizada com sucesso.`
      })

      // Recarregar a página para atualizar a lista
      router.refresh()
      
      if (onStatusChange) {
        onStatusChange()
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      
      // Tentar extrair mensagem de erro mais específica
      let errorMessage = 'Não foi possível atualizar o status da demanda.'
      
      if (error?.response) {
        try {
          const errorData = await error.response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = `Erro ${error.response.status}: ${error.response.statusText || errorMessage}`
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error('Erro ao atualizar status', {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const openConfirmDialog = (status: DemandStatusType, label: string, description: string) => {
    // Validação: impedir múltiplas demandas IN_PROGRESS
    if (status === 'IN_PROGRESS' && hasOtherInProgress) {
      toast.error('Você já está atendendo uma demanda', {
        description: 'Finalize o atendimento atual antes de iniciar outro.',
        duration: 5000,
      })
      return
    }

    setPendingAction({ status, label, description })
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (pendingAction) {
      handleStatusChange(pendingAction.status)
    }
  }

  // Definir ações disponíveis baseado no status atual
  const getAvailableActions = () => {
    switch (currentStatus) {
      case 'PENDING':
      case 'CHECK_IN':
        return [
          {
            status: 'IN_PROGRESS' as DemandStatusType,
            label: 'Iniciar Atendimento',
            icon: <Play className="w-4 h-4" />,
            bgColor: 'bg-blue-500 hover:bg-blue-600',
            description: `Iniciar o atendimento de ${applicantName}`
          }
        ]
      
      case 'IN_PROGRESS':
        return [
          {
            status: 'RESOLVED' as DemandStatusType,
            label: 'Finalizar Atendimento',
            icon: <CheckCircle className="w-4 h-4" />,
            bgColor: 'bg-emerald-500 hover:bg-emerald-600',
            description: `Marcar atendimento de ${applicantName} como finalizado`
          }
        ]
      
      default:
        return []
    }
  }

  const actions = getAvailableActions()

  if (actions.length === 0 || currentStatus === 'BILLED') {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.status}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openConfirmDialog(action.status, action.label, action.description)
            }}
            disabled={isLoading}
            className={`${action.bgColor} text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 px-4 py-2 text-sm font-semibold`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              action.icon
            )}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              Confirmar Ação
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              {pendingAction?.description}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Paciente:</span> {applicantName}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold">Nova ação:</span> {pendingAction?.label}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isLoading}
              className="border-slate-300 hover:bg-slate-100"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                'Confirmar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
