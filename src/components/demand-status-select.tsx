'use client'

// components/demand-status-select.tsx
// Seletor de status com permissões e campo de motivo

import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDemand, type UpdateDemandRequest } from '@/http/update-demand'
import { useDemandPermissions, type Demand } from '@/hooks/use-demand-permissions'
import { getTransitionErrorMessage, type DemandStatus } from '@/utils/demand-status-permissions'
import { translateStatus } from '@/constants/demand-translations'
import type { Role } from '@/lib/auth/roles'
import { toast } from 'sonner'
import { BadgeDemand } from './badge-demand'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'

interface DemandStatusSelectProps {
  demand: Demand
  userRole: Role
  currentMemberId: string | null
  organizationSlug: string
  unitSlug: string
  onStatusChange?: (newStatus: DemandStatus) => void
  showReasonField?: boolean
}

export function DemandStatusSelect({ 
  demand, 
  userRole,
  currentMemberId,
  organizationSlug,
  unitSlug,
  onStatusChange,
  showReasonField = true
}: DemandStatusSelectProps) {
  const queryClient = useQueryClient()
  const { availableStatuses, canEdit } = useDemandPermissions(
    demand, 
    userRole, 
    currentMemberId
  )
  
  const [selectedStatus, setSelectedStatus] = useState<DemandStatus | ''>(demand.status as DemandStatus)
  const [reason, setReason] = useState('')

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDemandRequest) => updateDemand(data),
    onSuccess: (_, variables) => {
      const statusLabel = translateStatus(variables.status!).label
      toast.success(`Status atualizado para "${statusLabel}"`, {
        description: reason || 'Mudança registrada com sucesso'
      })
      
      // Invalida cache para atualizar listagens
      queryClient.invalidateQueries({
        queryKey: ['demands', organizationSlug, unitSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['demand', demand.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['demand-history', organizationSlug, unitSlug, demand.id],
      })
      
      // Reset
      setReason('')
      setSelectedStatus(variables.status as DemandStatus)
      
      // Callback
      onStatusChange?.(variables.status as DemandStatus)
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar status:', error)
      
      if (error.response?.status === 400) {
        // Erro de validação do backend
        const errorMessage = error.message || 'Transição de status inválida'
        toast.error('Não foi possível atualizar', {
          description: errorMessage
        })
      } else if (error.response?.status === 401) {
        // Erro de permissão
        toast.error('Acesso negado', {
          description: 'Você não tem permissão para esta ação'
        })
      } else {
        toast.error('Erro ao atualizar status', {
          description: 'Tente novamente em alguns instantes'
        })
      }
    }
  })

  const handleStatusChange = (newStatus: string) => {
    if (!newStatus || newStatus === demand.status) {
      setSelectedStatus(demand.status as DemandStatus)
      return
    }

    setSelectedStatus(newStatus as DemandStatus)
  }

  const handleSubmit = async () => {
    if (!selectedStatus || selectedStatus === demand.status) {
      toast.warning('Selecione um novo status')
      return
    }

    // Validação client-side
    const errorMessage = getTransitionErrorMessage(
      userRole,
      demand.status as DemandStatus,
      selectedStatus as DemandStatus
    )
    
    if (errorMessage) {
      toast.error('Transição inválida', {
        description: errorMessage
      })
      return
    }

    await updateMutation.mutateAsync({
      organizationSlug,
      unitSlug,
      demandId: demand.id,
      status: selectedStatus,
      reason: reason || undefined
    })
  }

  // Se não pode editar, mostra apenas badge
  if (!canEdit || availableStatuses.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status Atual</Label>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <BadgeDemand status={demand.status} size="md" />
        </div>
        {!canEdit && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Você não pode alterar este status
          </p>
        )}
      </div>
    )
  }

  const hasChanges = selectedStatus !== demand.status

  return (
    <div className="space-y-4">
      {/* Status Atual */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status Atual</Label>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <BadgeDemand status={demand.status} size="md" />
        </div>
      </div>

      {/* Novo Status */}
      <div className="space-y-2">
        <Label htmlFor="new-status" className="text-sm font-medium">
          Novo Status
        </Label>
        <Select 
          value={selectedStatus}
          onValueChange={handleStatusChange}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger id="new-status" className="w-full">
            <SelectValue placeholder="Selecione o novo status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={demand.status}>
              {translateStatus(demand.status).label} (atual)
            </SelectItem>
            {availableStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {translateStatus(status).icon} {translateStatus(status).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {availableStatuses.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {availableStatuses.length} transição(ões) disponível(is)
          </p>
        )}
      </div>

      {/* Campo de Motivo */}
      {showReasonField && hasChanges && (
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Motivo da Mudança <span className="text-gray-400">(opcional)</span>
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Descreva o motivo da mudança de status..."
            disabled={updateMutation.isPending}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Este motivo será registrado no histórico de auditoria
          </p>
        </div>
      )}

      {/* Botão de Confirmar */}
      {hasChanges && (
        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending || !selectedStatus}
          className="w-full"
          size="lg"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Mudança
            </>
          )}
        </Button>
      )}
    </div>
  )
}
