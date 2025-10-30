import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

// Interface para a resposta da IA
interface TriageAnalysis {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  specialty: string
  estimatedDuration: number // em minutos
  keywords: string[]
  suggestedActions: string[]
  confidence: number // 0-100
}

export async function POST(request: NextRequest) {
  try {
    const { description, title } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Descrição da demanda é obrigatória' },
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

    console.log('🤖 Iniciando análise de triagem...')
    console.log('📝 Título:', title)
    console.log('📝 Descrição:', description)

    // Chama a API da OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo rápido e barato
        messages: [
          {
            role: 'system',
            content: `Você é um assistente de triagem médica/clínica especializado em análise de demandas.

Analise a descrição da demanda e retorne um JSON com:
{
  "priority": "low" | "medium" | "high" | "urgent",
  "specialty": "nome da especialidade médica necessária",
  "estimatedDuration": número em minutos,
  "keywords": ["lista", "de", "palavras-chave", "importantes"],
  "suggestedActions": ["lista de ações sugeridas"],
  "confidence": número de 0-100 representando sua confiança na análise
}

Critérios de prioridade:
- urgent: risco de vida, dor intensa, sangramento grave, sintomas agudos graves
- high: sintomas severos mas estáveis, condições que precisam atenção rápida
- medium: sintomas moderados, consultas de rotina importantes
- low: consultas preventivas, check-ups, acompanhamentos leves

Retorne APENAS o JSON, sem texto adicional.`
          },
          {
            role: 'user',
            content: `Título: ${title || 'Sem título'}\n\nDescrição: ${description}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Mais determinístico
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro da OpenAI:', error)
      return NextResponse.json(
        { error: 'Erro ao processar análise' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const analysis: TriageAnalysis = JSON.parse(data.choices[0].message.content)

    console.log('✅ Análise concluída:', analysis)

    return NextResponse.json({
      success: true,
      analysis,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens,
      },
    })

  } catch (error: any) {
    console.error('❌ Erro na análise de triagem:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar análise',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
