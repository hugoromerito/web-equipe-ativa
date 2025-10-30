'use client'

// components/demand-history.tsx
// Componente para visualizar histórico de mudanças de status de uma demand

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, User, AlertCircle, FileText } from 'lucide-react'
import { getDemandHistory, type DemandStatusAuditLog } from '@/http/get-demand-history'
import { BadgeDemand } from './badge-demand'
import { translateRole } from '@/constants/role-translations'

interface DemandHistoryProps {
  organizationSlug: string
  unitSlug: string
  demandId: string
}

export function DemandHistory({ 
  organizationSlug, 
  unitSlug, 
  demandId 
}: DemandHistoryProps) {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['demand-history', organizationSlug, unitSlug, demandId],
    queryFn: () => getDemandHistory(organizationSlug, unitSlug, demandId),
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o histórico
        </p>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-700">Sem histórico</p>
        <p className="text-xs text-muted-foreground mt-1">
          Nenhuma mudança de status registrada ainda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Histórico de Mudanças
      </h3>
      
      <div className="space-y-3">
        {history.map((log, index) => (
          <div 
            key={log.id}
            className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
          >
            {/* Dot indicator */}
            <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-white border-2 border-primary" />
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <BadgeDemand status={log.newStatus} size="sm" animated={false} />
                  <span className="text-xs text-gray-400">←</span>
                  <BadgeDemand status={log.previousStatus} size="sm" animated={false} />
                </div>
                
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.changedAt), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{log.changedByUserName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {translateRole(log.changedByRole)}
                </span>
              </div>

              {/* Reason */}
              {log.reason && (
                <div className="mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 italic">
                      "{log.reason}"
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp detail */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(log.changedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
