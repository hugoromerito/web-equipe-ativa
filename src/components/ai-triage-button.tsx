'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, AlertCircle, CheckCircle, Clock, Tag } from 'lucide-react'
import { useAITriage, getPriorityColor, getPriorityLabel } from '@/hooks/use-ai-triage'
import { toast } from 'sonner'

interface AITriageButtonProps {
  title?: string
  description: string
  onAnalysisComplete?: (analysis: any) => void
  disabled?: boolean
}

export function AITriageButton({ 
  title, 
  description, 
  onAnalysisComplete,
  disabled 
}: AITriageButtonProps) {
  const { mutate: analyze, isPending, data } = useAITriage()

  const handleAnalyze = () => {
    if (!description || description.trim().length < 10) {
      toast.error('A descrição precisa ter pelo menos 10 caracteres')
      return
    }

    analyze({ title, description }, {
      onSuccess: (response) => {
        toast.success('Análise concluída com sucesso!', {
          description: `Prioridade sugerida: ${getPriorityLabel(response.analysis.priority)}`
        })
        onAnalysisComplete?.(response.analysis)
      },
      onError: (error: any) => {
        toast.error('Erro ao analisar', {
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
        onClick={handleAnalyze}
        disabled={isPending || disabled || !description}
        className="w-full gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando com IA...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Analisar com IA
          </>
        )}
      </Button>

      {/* Resultado da Análise */}
      {data && (
        <div className="rounded-lg border bg-card p-4 space-y-3 animate-in fade-in-50 duration-300">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Análise Concluída</span>
          </div>

          {/* Prioridade */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Prioridade Sugerida
            </label>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${getPriorityColor(data.analysis.priority)}`}>
              <span className="font-medium">{getPriorityLabel(data.analysis.priority)}</span>
              <span className="text-xs">({data.analysis.confidence}% confiança)</span>
            </div>
          </div>

          {/* Especialidade */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Especialidade
            </label>
            <p className="text-sm bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md border border-blue-200 inline-block">
              {data.analysis.specialty}
            </p>
          </div>

          {/* Tempo Estimado */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo Estimado
            </label>
            <p className="text-sm text-muted-foreground">
              {data.analysis.estimatedDuration} minutos
            </p>
          </div>

          {/* Palavras-chave */}
          {data.analysis.keywords.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Palavras-chave</label>
              <div className="flex flex-wrap gap-1.5">
                {data.analysis.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ações Sugeridas */}
          {data.analysis.suggestedActions.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Ações Sugeridas</label>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {data.analysis.suggestedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Custo da Análise */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Tokens usados: {data.tokens.total} 
            <span className="ml-2">
              (~R$ {(data.tokens.total * 0.00000015).toFixed(4)})
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
