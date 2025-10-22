import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AZURE_SPEECH_KEY
    const region = process.env.AZURE_SPEECH_REGION || 'eastus'

    if (!apiKey) {
      console.error('❌ AZURE_SPEECH_KEY não configurada')
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      )
    }

    // Vozes Neurais em Português do Brasil (pt-BR)
    // RECOMENDADA para TEA: Francisca (feminina, calma, clara)
    const voiceName = 'pt-BR-FranciscaNeural'
    
    // Alternativas:
    // 'pt-BR-BrendaNeural'   - Feminina, jovem, energética
    // 'pt-BR-AntonioNeural'  - Masculino, profissional, clara
    // 'pt-BR-ThalitaNeural'  - Feminina, suave, amigável

    // Cria o SSML (Speech Synthesis Markup Language) para controle fino
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR">
        <voice name="${voiceName}">
          <prosody rate="0.90" pitch="-2%" volume="100">
            ${text}
          </prosody>
        </voice>
      </speak>
    `

    // Chama a API do Azure Speech
    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', // Qualidade alta
        },
        body: ssml,
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro Azure Speech:', error)
      return NextResponse.json(
        { error: 'Erro ao sintetizar voz' },
        { status: response.status }
      )
    }

    // Converte o áudio para base64
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      audioContent: base64Audio,
    })
  } catch (error) {
    console.error('❌ Erro ao processar TTS:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
