'use client'

import { useState } from 'react'
import { AITriageButton } from '@/components/ai-triage-button'
import { AISummaryButton } from '@/components/ai-summary-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestAIPage() {
  // Estado para Triagem
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Estado para Resumo
  const [mockDemands] = useState([
    {
      title: 'Consulta Cardiológica',
      description: 'Paciente relatou dor no peito intermitente nos últimos 3 dias. Pressão arterial elevada (150/95). Histórico familiar de problemas cardíacos.',
      status: 'COMPLETED',
      priority: 'high',
      createdAt: '2024-10-01T10:30:00Z',
    },
    {
      title: 'Retorno Cardiologia',
      description: 'Resultado do ECG mostra alterações leves. Iniciado tratamento com beta-bloqueador. Paciente relata melhora na dor.',
      status: 'COMPLETED',
      priority: 'medium',
      createdAt: '2024-10-08T14:00:00Z',
    },
    {
      title: 'Consulta Dermatológica',
      description: 'Manchas vermelhas na pele do braço há 2 semanas. Sem coceira ou dor. Possível alergia a medicamento.',
      status: 'COMPLETED',
      priority: 'low',
      createdAt: '2024-10-15T11:15:00Z',
    },
    {
      title: 'Check-up Anual',
      description: 'Exames de rotina realizados. Colesterol levemente elevado (220 mg/dL). Glicemia normal. Recomendada dieta e exercícios.',
      status: 'COMPLETED',
      priority: 'low',
      createdAt: '2024-10-20T09:00:00Z',
    },
  ])

  const testExamples = [
    {
      name: 'Emergência Cardíaca',
      title: 'Dor intensa no peito',
      description: 'Paciente com dor intensa no peito há 2 horas, suor frio, falta de ar e náuseas. Pressão arterial 180/110. Histórico de hipertensão não controlada.',
      expected: 'Urgente - Cardiologia',
    },
    {
      name: 'Fratura Suspeita',
      title: 'Queda com dor no braço',
      description: 'Paciente sofreu queda de escada há 1 hora. Dor intensa no braço direito, inchaço visível e dificuldade de movimentar. Possível fratura.',
      expected: 'Alta - Ortopedia',
    },
    {
      name: 'Infecção Respiratória',
      title: 'Tosse e febre',
      description: 'Tosse produtiva há 5 dias, febre de 38.5°C, dificuldade para respirar ao fazer esforço. Sem histórico de asma.',
      expected: 'Alta - Pneumologia',
    },
    {
      name: 'Consulta Dermatológica',
      title: 'Manchas na pele',
      description: 'Manchas vermelhas na pele há 1 semana, sem dor ou coceira. Sem febre ou outros sintomas. Aparência de alergia.',
      expected: 'Média - Dermatologia',
    },
    {
      name: 'Check-up de Rotina',
      title: 'Exames anuais',
      description: 'Paciente deseja realizar check-up anual. Sem queixas atuais. Último exame há 12 meses. Todos os resultados anteriores normais.',
      expected: 'Baixa - Clínico Geral',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10">
      <div className="container max-w-4xl mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🤖 Sistema de IA Médica
          </h1>
          <p className="text-muted-foreground">
            Teste as funcionalidades de Inteligência Artificial
          </p>
        </div>

        <Tabs defaultValue="triage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="triage">✨ Triagem Inteligente</TabsTrigger>
            <TabsTrigger value="summary">📋 Resumo de Histórico</TabsTrigger>
          </TabsList>

          {/* TAB 1: Triagem */}
          <TabsContent value="triage" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título da Demanda
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consulta urgente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição / Sintomas
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva os sintomas, queixas ou motivo da consulta..."
                />
              </div>

              <AITriageButton
                title={title}
                description={description}
                onAnalysisComplete={(analysis) => {
                  console.log('✅ Análise concluída:', analysis)
                }}
              />
            </div>

            {/* Exemplos Rápidos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎯</span>
                Exemplos para Teste Rápido
              </h2>
              <div className="space-y-3">
                {testExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTitle(example.title)
                      setDescription(example.description)
                    }}
                    className="w-full text-left p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="font-medium group-hover:text-blue-600">
                          {example.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {example.description}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded whitespace-nowrap">
                        {example.expected}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Resumo */}
          <TabsContent value="summary" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Histórico do Paciente (Mock)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Este exemplo usa dados fictícios para demonstração
                </p>
              </div>

              {/* Lista de Demandas Mock */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {mockDemands.map((demand, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{demand.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {demand.description}
                        </p>
                      </div>
                      <span className="text-xs bg-white px-2 py-1 rounded border">
                        {new Date(demand.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <AISummaryButton
                demands={mockDemands}
                patientName="João Silva (Mock)"
                onSummaryGenerated={(summary) => {
                  console.log('✅ Resumo gerado:', summary)
                }}
              />
            </div>

            {/* Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Na aplicação real, você pode integrar isso na página de 
                detalhes do paciente para gerar resumos automáticos do histórico médico completo.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Informações de Custo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-3">💰 Custo Estimado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Triagem por Demanda:</p>
              <p className="text-muted-foreground">~350 tokens = R$ 0,0003</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Resumo de Histórico:</p>
              <p className="text-muted-foreground">~1000 tokens = R$ 0,0008</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">1000 triagens/mês:</p>
              <p className="text-green-600 font-medium">R$ 0,30/mês</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">500 resumos/mês:</p>
              <p className="text-green-600 font-medium">R$ 0,40/mês</p>
            </div>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-muted-foreground">
          <p>
            Documentação completa em <code className="bg-white px-2 py-1 rounded">AI_TRIAGE_GUIDE.md</code>
          </p>
        </div>
      </div>
    </div>
  )
}
