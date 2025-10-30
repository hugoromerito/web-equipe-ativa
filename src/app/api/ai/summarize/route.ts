import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

interface SummaryRequest {
  demands: Array<{
    title: string
    description: string
    status: string
    priority: string
    createdAt: string
  }>
  patientName?: string
}

export async function POST(request: NextRequest) {
  try {
    const { demands, patientName } = await request.json() as SummaryRequest

    if (!demands || demands.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma demanda fornecida' },
        { status: 400 }
      )
    }

    const apiKey = env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY não configurada')
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      )
    }

    console.log('🤖 Gerando resumo de histórico...')
    console.log('📋 Total de demandas:', demands.length)

    // Formata o histórico para análise
    const historyText = demands
      .map((d, idx) => {
        const date = new Date(d.createdAt).toLocaleDateString('pt-BR')
        return `${idx + 1}. [${date}] ${d.title}
   Status: ${d.status} | Prioridade: ${d.priority}
   Descrição: ${d.description}
   ---`
      })
      .join('\n\n')

    // Chama a API da OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente médico especializado em análise de prontuários.

Analise o histórico de demandas do paciente e crie um resumo profissional e estruturado em JSON com:

{
  "summaryBrief": "Resumo executivo em 2-3 frases",
  "mainConditions": ["lista das principais condições identificadas"],
  "timeline": [
    {
      "period": "descrição do período",
      "events": ["eventos relevantes neste período"]
    }
  ],
  "patterns": ["padrões identificados no histórico"],
  "recommendations": ["recomendações para próximos atendimentos"],
  "redFlags": ["sinais de alerta identificados (se houver)"],
  "totalVisits": número total de visitas,
  "mostCommonIssues": ["problemas mais recorrentes"]
}

Seja objetivo, profissional e focado em informações clinicamente relevantes.
Retorne APENAS o JSON, sem texto adicional.`
          },
          {
            role: 'user',
            content: `Paciente: ${patientName || 'Não informado'}

Histórico de Demandas:
${historyText}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro da OpenAI:', error)
      return NextResponse.json(
        { error: 'Erro ao processar resumo' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const summary = JSON.parse(data.choices[0].message.content)

    console.log('✅ Resumo gerado com sucesso')

    return NextResponse.json({
      success: true,
      summary,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens,
      },
      metadata: {
        demandsAnalyzed: demands.length,
        patientName,
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao gerar resumo:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar resumo',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
