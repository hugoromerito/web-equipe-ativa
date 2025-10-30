import { useMutation } from '@tanstack/react-query'

interface Demand {
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
}

interface SummarizeRequest {
  demands: Demand[]
  patientName?: string
}

interface Timeline {
  period: string
  events: string[]
}

interface Summary {
  summaryBrief: string
  mainConditions: string[]
  timeline: Timeline[]
  patterns: string[]
  recommendations: string[]
  redFlags: string[]
  totalVisits: number
  mostCommonIssues: string[]
}

interface SummarizeResponse {
  success: boolean
  summary: Summary
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  metadata: {
    demandsAnalyzed: number
    patientName?: string
  }
}

async function summarizeHistory(data: SummarizeRequest): Promise<SummarizeResponse> {
  const response = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao gerar resumo')
  }

  return response.json()
}

export function useAISummarize() {
  return useMutation({
    mutationFn: summarizeHistory,
  })
}

export type { Summary, Timeline, SummarizeRequest, SummarizeResponse }
