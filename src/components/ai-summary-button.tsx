'use client'

import { Button } from '@/components/ui/button'
import { FileText, Loader2, AlertTriangle, TrendingUp, Calendar, Stethoscope } from 'lucide-react'
import { useAISummarize, type Summary } from '@/hooks/use-ai-summarize'
import { toast } from 'sonner'

interface AISummaryButtonProps {
  demands: Array<{
    title: string
    description: string
    status: string
    priority: string
    createdAt: string
  }>
  patientName?: string
  onSummaryGenerated?: (summary: Summary) => void
  disabled?: boolean
}

export function AISummaryButton({ 
  demands, 
  patientName,
  onSummaryGenerated,
  disabled 
}: AISummaryButtonProps) {
  const { mutate: summarize, isPending, data } = useAISummarize()

  const handleSummarize = () => {
    if (!demands || demands.length === 0) {
      toast.error('Nenhuma demanda para resumir')
      return
    }

    summarize({ demands, patientName }, {
      onSuccess: (response) => {
        toast.success('Resumo gerado com sucesso!', {
          description: `${response.metadata.demandsAnalyzed} demandas analisadas`
        })
        onSummaryGenerated?.(response.summary)
      },
      onError: (error: any) => {
        toast.error('Erro ao gerar resumo', {
          description: error.message
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleSummarize}
        disabled={isPending || disabled || !demands || demands.length === 0}
        className="w-full gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gerando resumo com IA...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Gerar Resumo Inteligente ({demands?.length || 0} demandas)
          </>
        )}
      </Button>

      {/* Resultado do Resumo */}
      {data && (
        <div className="rounded-lg border bg-card p-6 space-y-4 animate-in fade-in-50 duration-300">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <span>Resumo do Histórico Médico</span>
          </div>

          {/* Resumo Breve */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm leading-relaxed">{data.summary.summaryBrief}</p>
          </div>

          {/* Principais Condições */}
          {data.summary.mainConditions.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Principais Condições Identificadas
              </h3>
              <ul className="space-y-1">
                {data.summary.mainConditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Linha do Tempo */}
          {data.summary.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Linha do Tempo
              </h3>
              <div className="space-y-3">
                {data.summary.timeline.map((period, idx) => (
                  <div key={idx} className="border-l-2 border-gray-300 pl-4">
                    <p className="font-medium text-sm text-gray-700">{period.period}</p>
                    <ul className="mt-1 space-y-1">
                      {period.events.map((event, eventIdx) => (
                        <li key={eventIdx} className="text-sm text-gray-600">
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Padrões Identificados */}
          {data.summary.patterns.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Padrões Identificados
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <ul className="space-y-1">
                  {data.summary.patterns.map((pattern, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-600 mt-0.5">▸</span>
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Sinais de Alerta */}
          {data.summary.redFlags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Sinais de Alerta
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <ul className="space-y-1">
                  {data.summary.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="mt-0.5">⚠️</span>
                      <span className="font-medium">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recomendações */}
          {data.summary.recommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Recomendações para Próximos Atendimentos</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <ul className="space-y-1.5">
                  {data.summary.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Problemas Mais Comuns */}
          {data.summary.mostCommonIssues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Problemas Mais Recorrentes</h3>
              <div className="flex flex-wrap gap-2">
                {data.summary.mostCommonIssues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full border border-purple-200"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Estatísticas */}
          <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
            <p>Total de visitas analisadas: <strong>{data.summary.totalVisits}</strong></p>
            <p>Tokens usados: {data.tokens.total} (~R$ {(data.tokens.total * 0.00000015).toFixed(4)})</p>
          </div>
        </div>
      )}
    </div>
  )
}
