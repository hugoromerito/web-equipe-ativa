# 🤖 Sistema de Triagem Inteligente com IA

## ✅ O que foi implementado

### 1. **API Route** (`/api/ai/triage`)
- Analisa descrição de demandas com GPT-4o-mini
- Retorna: prioridade, especialidade, tempo estimado, keywords, ações sugeridas
- **Custo:** ~R$ 0,0003 por análise (quase de graça!)

### 2. **Hook React** (`useAITriage`)
- Hook para usar a IA de forma simples
- Gerencia loading, sucesso e erros
- Funções helpers para cores e labels

### 3. **Componente UI** (`AITriageButton`)
- Botão "Analisar com IA" ✨
- Mostra resultado visual da análise
- Feedback com toast notifications

---

## 🧪 Como Testar Agora

### **Opção 1: Teste Rápido via API**

1. Certifique-se que o servidor está rodando:
```powershell
npm run dev
```

2. Abra outro terminal e teste:
```powershell
curl http://localhost:3000/api/ai/triage -X POST -H "Content-Type: application/json" -d "{\"title\":\"Consulta urgente\",\"description\":\"Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar\"}"
```

**Ou use Postman/Insomnia:**
- URL: `http://localhost:3000/api/ai/triage`
- Método: `POST`
- Body (JSON):
```json
{
  "title": "Consulta urgente",
  "description": "Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "analysis": {
    "priority": "urgent",
    "specialty": "Cardiologia",
    "estimatedDuration": 30,
    "keywords": ["dor no peito", "suor frio", "falta de ar", "urgência"],
    "suggestedActions": [
      "Encaminhar imediatamente para cardiologista",
      "Verificar sinais vitais",
      "Considerar atendimento de emergência"
    ],
    "confidence": 95
  },
  "tokens": {
    "prompt": 250,
    "completion": 100,
    "total": 350
  }
}
```

---

### **Opção 2: Integrar no Formulário de Criar Demanda**

Encontre o arquivo do formulário de criação de demanda (provavelmente em `src/app/(app)/org/[org]/unit/[unit]/applicant/[applicant]/page.tsx` ou similar) e adicione:

```tsx
import { AITriageButton } from '@/components/ai-triage-button'

// No componente do formulário:
const [description, setDescription] = useState('')
const [priority, setPriority] = useState('medium')

// Adicione o botão logo após o campo de descrição:
<AITriageButton
  title={title}
  description={description}
  onAnalysisComplete={(analysis) => {
    // Auto-preenche a prioridade sugerida
    setPriority(analysis.priority)
    
    // Mostra um toast com sugestões
    toast.success('Sugestão: ' + analysis.specialty, {
      description: analysis.suggestedActions[0]
    })
  }}
/>
```

---

### **Opção 3: Criar Página de Teste Dedicada**

Crie `src/app/test-ai/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { AITriageButton } from '@/components/ai-triage-button'

export default function TestAIPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="container max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">🤖 Teste de Triagem com IA</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Consulta urgente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva os sintomas ou motivo da consulta..."
          />
        </div>

        <AITriageButton
          title={title}
          description={description}
          onAnalysisComplete={(analysis) => {
            console.log('Análise:', analysis)
          }}
        />
      </div>

      {/* Exemplos para teste rápido */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">Exemplos para testar:</h2>
        <div className="space-y-2">
          <button
            onClick={() => {
              setTitle('Consulta urgente')
              setDescription('Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar. Histórico de pressão alta.')
            }}
            className="text-sm text-blue-600 hover:underline block"
          >
            ➤ Teste 1: Emergência Cardíaca (prioridade: urgente)
          </button>
          
          <button
            onClick={() => {
              setTitle('Consulta dermatológica')
              setDescription('Manchas vermelhas na pele há 1 semana, sem dor ou coceira. Sem febre.')
            }}
            className="text-sm text-blue-600 hover:underline block"
          >
            ➤ Teste 2: Dermatologia (prioridade: média)
          </button>
          
          <button
            onClick={() => {
              setTitle('Check-up anual')
              setDescription('Paciente deseja realizar exames de rotina. Sem queixas. Último check-up há 12 meses.')
            }}
            className="text-sm text-blue-600 hover:underline block"
          >
            ➤ Teste 3: Check-up (prioridade: baixa)
          </button>
        </div>
      </div>
    </div>
  )
}
```

Acesse: `http://localhost:3000/test-ai`

---

## 💡 Exemplos de Uso Real

### **Caso 1: Emergência**
```json
{
  "description": "Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar"
}
```
**Resultado:** 
- Prioridade: **URGENTE** 🔴
- Especialidade: Cardiologia
- Tempo: 30 min

### **Caso 2: Consulta Normal**
```json
{
  "description": "Dor de cabeça leve há 3 dias, piora à noite"
}
```
**Resultado:**
- Prioridade: **MÉDIA** 🟡
- Especialidade: Neurologia
- Tempo: 20 min

### **Caso 3: Rotina**
```json
{
  "description": "Check-up anual, sem queixas"
}
```
**Resultado:**
- Prioridade: **BAIXA** 🟢
- Especialidade: Clínico Geral
- Tempo: 15 min

---

## 💰 Custo Real

### **GPT-4o-mini:**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

### **Por análise:**
- ~250 tokens input + ~100 tokens output = 350 tokens
- Custo: **R$ 0,0003** (menos de 1 centavo!)

### **Mensal (1000 demandas):**
- 1000 × R$ 0,0003 = **R$ 0,30/mês** 🤯

---

## 🎯 Próximos Passos

1. **Teste a API** com curl/Postman
2. **Integre no formulário** de criar demanda
3. **Ajuste o prompt** se necessário (em `route.ts`)
4. **Adicione mais features:**
   - Salvar sugestão da IA no banco
   - Permitir aceitar/rejeitar sugestão
   - Histórico de análises

---

## 🔧 Troubleshooting

### Erro: "API key não configurada"
Adicione no `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-...sua-chave-aqui
```

### Erro: "Module not found"
```powershell
npm install
```

### Componente não aparece
Verifique se importou corretamente:
```tsx
import { AITriageButton } from '@/components/ai-triage-button'
```

---

## 📚 Documentação

- OpenAI API: https://platform.openai.com/docs
- Preços: https://openai.com/api/pricing/
- GPT-4o-mini: https://platform.openai.com/docs/models/gpt-4o-mini
