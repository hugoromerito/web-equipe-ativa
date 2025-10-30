import { useMutation } from '@tanstack/react-query'

interface TriageRequest {
  title?: string
  description: string
}

interface TriageAnalysis {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  specialty: string
  estimatedDuration: number
  keywords: string[]
  suggestedActions: string[]
  confidence: number
}

interface TriageResponse {
  success: boolean
  analysis: TriageAnalysis
  tokens: {
    prompt: number
    completion: number
    total: number
  }
}

async function analyzeWithAI(data: TriageRequest): Promise<TriageResponse> {
  const response = await fetch('/api/ai/triage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao analisar com IA')
  }

  return response.json()
}

export function useAITriage() {
  return useMutation({
    mutationFn: analyzeWithAI,
  })
}

// Função helper para obter cor baseada na prioridade
export function getPriorityColor(priority: string) {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[priority as keyof typeof colors] || colors.medium
}

// Função helper para obter label da prioridade em português
export function getPriorityLabel(priority: string) {
  const labels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente',
  }
  return labels[priority as keyof typeof labels] || 'Média'
}
