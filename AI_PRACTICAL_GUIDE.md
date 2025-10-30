# 🤖 IA na Prática - Guia Completo de Teste

## ✅ O que foi criado

### **1. Triagem Inteligente**
- 📍 API: `/api/ai/triage`
- 📍 Hook: `src/hooks/use-ai-triage.ts`
- 📍 Componente: `src/components/ai-triage-button.tsx`

**Funcionalidade:**
- Analisa descrição da demanda
- Sugere prioridade (baixa/média/alta/urgente)
- Identifica especialidade necessária
- Estima tempo de atendimento
- Extrai palavras-chave
- Sugere ações

### **2. Resumo de Histórico**
- 📍 API: `/api/ai/summarize`
- 📍 Hook: `src/hooks/use-ai-summarize.ts`
- 📍 Componente: `src/components/ai-summary-button.tsx`

**Funcionalidade:**
- Resume histórico completo do paciente
- Identifica condições principais
- Cria linha do tempo
- Detecta padrões
- Lista sinais de alerta
- Sugere recomendações

### **3. Página de Teste**
- 📍 Página: `src/app/test-ai/page.tsx`
- 📍 URL: `http://localhost:3000/test-ai`

---

## 🚀 Como Testar AGORA (3 minutos)

### **Passo 1: Verificar OPENAI_API_KEY**

1. Abra o arquivo `.env.local` na raiz do projeto
2. Verifique se tem:
```bash
OPENAI_API_KEY=sk-proj-...
```

3. Se não tiver, adicione sua chave da OpenAI
4. Salve o arquivo

### **Passo 2: Instalar Dependências (se necessário)**

```powershell
npm install
```

### **Passo 3: Iniciar o Servidor**

```powershell
npm run dev
```

### **Passo 4: Acessar a Página de Teste**

Abra o navegador em:
```
http://localhost:3000/test-ai
```

### **Passo 5: Testar Triagem**

1. Clique na aba "✨ Triagem Inteligente"
2. Clique em um dos exemplos (ex: "Emergência Cardíaca")
3. Clique em "Analisar com IA"
4. Veja o resultado em ~2-3 segundos

**Resultado esperado:**
- Prioridade: URGENTE (vermelho)
- Especialidade: Cardiologia
- Tempo: ~30 minutos
- Keywords: dor no peito, suor frio, etc.
- Ações sugeridas

### **Passo 6: Testar Resumo**

1. Clique na aba "📋 Resumo de Histórico"
2. Clique em "Gerar Resumo Inteligente"
3. Aguarde ~3-5 segundos
4. Veja o resumo completo gerado

**Resultado esperado:**
- Resumo executivo
- Principais condições
- Linha do tempo
- Padrões identificados
- Recomendações

---

## 🧪 Teste Via API Diretamente

### **Teste 1: Triagem**

Abra um terminal e execute:

```powershell
curl http://localhost:3000/api/ai/triage -X POST -H "Content-Type: application/json" -d "{\"title\":\"Dor no peito\",\"description\":\"Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar\"}"
```

**Ou use este script PowerShell:**
```powershell
$body = @{
    title = "Dor no peito"
    description = "Paciente com dor intensa no peito há 2 horas, suor frio e falta de ar"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ai/triage" -Method POST -Body $body -ContentType "application/json"
```

### **Teste 2: Resumo**

```powershell
$body = @{
    patientName = "João Silva"
    demands = @(
        @{
            title = "Consulta Cardiológica"
            description = "Dor no peito intermitente"
            status = "COMPLETED"
            priority = "high"
            createdAt = "2024-10-01T10:00:00Z"
        },
        @{
            title = "Retorno"
            description = "Melhora após medicação"
            status = "COMPLETED"
            priority = "medium"
            createdAt = "2024-10-08T10:00:00Z"
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:3000/api/ai/summarize" -Method POST -Body $body -ContentType "application/json"
```

---

## 🎯 Integrar no Projeto Real

### **Opção 1: Adicionar no Formulário de Criar Demanda**

Encontre o formulário de criação de demanda e adicione:

```tsx
import { AITriageButton } from '@/components/ai-triage-button'
import { useState } from 'react'

// No componente:
const [description, setDescription] = useState('')
const [suggestedPriority, setSuggestedPriority] = useState('')

// Logo após o campo de descrição:
<AITriageButton
  title={title}
  description={description}
  onAnalysisComplete={(analysis) => {
    // Auto-preenche a prioridade
    setSuggestedPriority(analysis.priority)
    
    // Mostra notificação
    toast.info(`Sugestão IA: ${analysis.specialty}`, {
      description: `Prioridade: ${analysis.priority.toUpperCase()}`
    })
  }}
/>

{suggestedPriority && (
  <p className="text-sm text-blue-600">
    💡 IA sugere: Prioridade <strong>{suggestedPriority}</strong>
  </p>
)}
```

### **Opção 2: Adicionar na Página de Detalhes do Paciente**

Na página que mostra histórico do paciente:

```tsx
import { AISummaryButton } from '@/components/ai-summary-button'

// Busque as demandas do paciente
const { data: demands } = useQuery({
  queryKey: ['applicant-demands', applicantId],
  queryFn: () => getApplicantDemands(applicantId)
})

// Adicione o botão
<AISummaryButton
  demands={demands || []}
  patientName={applicant.name}
  onSummaryGenerated={(summary) => {
    console.log('Resumo:', summary)
    // Você pode exibir em um modal, salvar no banco, etc.
  }}
/>
```

---

## 📊 Monitorar Uso e Custos

### **Ver logs no console:**
```powershell
# No terminal onde o npm run dev está rodando:
# Você verá logs como:
🤖 Iniciando análise de triagem...
✅ Análise concluída: {...}
```

### **Calcular custo:**
- Cada análise mostra os tokens usados
- GPT-4o-mini: $0.15/1M tokens (input) + $0.60/1M tokens (output)
- Exemplo: 350 tokens = ~R$ 0,0003

### **Limitar uso (opcional):**
Adicione rate limiting em `src/app/api/ai/triage/route.ts`:

```typescript
// Limite: 100 análises por dia por usuário
const rateLimiter = new Map()

export async function POST(request: NextRequest) {
  const userId = request.headers.get('user-id') // ou via session
  
  const count = rateLimiter.get(userId) || 0
  if (count >= 100) {
    return NextResponse.json(
      { error: 'Limite diário atingido' },
      { status: 429 }
    )
  }
  
  rateLimiter.set(userId, count + 1)
  
  // ... resto do código
}
```

---

## 🔧 Troubleshooting

### ❌ Erro: "API key não configurada"

**Solução:**
1. Crie/edite `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-...sua-chave
```
2. Reinicie o servidor: `Ctrl+C` e depois `npm run dev`

### ❌ Erro: "Module not found: @/components/ui/tabs"

**Solução:**
```powershell
npm install @radix-ui/react-tabs
```

### ❌ Erro: "fetch failed"

**Solução:**
- Verifique se tem internet
- Teste a API da OpenAI diretamente: https://platform.openai.com/playground
- Verifique se a chave está ativa

### ❌ Resposta muito lenta

**Solução:**
- Normal: ~2-5 segundos
- Se > 10s, pode ser problema de rede
- Use GPT-4o-mini (mais rápido que GPT-4)

---

## 💡 Ideias de Melhorias

### **1. Salvar Análises no Banco**
```typescript
// Criar tabela ai_analyses
interface AIAnalysis {
  id: string
  demandId: string
  type: 'triage' | 'summary'
  result: JSON
  tokensUsed: number
  createdAt: Date
}

// Salvar após análise
await prisma.aiAnalysis.create({
  data: {
    demandId,
    type: 'triage',
    result: analysis,
    tokensUsed: tokens.total
  }
})
```

### **2. Histórico de Sugestões da IA**
- Mostrar se o médico aceitou/rejeitou sugestão
- Treinar modelo customizado com feedback
- Dashboard de acurácia da IA

### **3. Auto-Triagem ao Criar Demanda**
```typescript
// Analisar automaticamente quando criar demanda
export async function createDemand(data) {
  const demand = await api.post('/demands', data)
  
  // Análise em background
  analyzeWithAI({ 
    title: data.title, 
    description: data.description 
  })
  
  return demand
}
```

### **4. Notificações Inteligentes**
```typescript
// Se IA detectar urgência, notificar gestor
if (analysis.priority === 'urgent') {
  await sendNotification({
    to: 'gestor@hospital.com',
    message: `⚠️ Demanda URGENTE detectada: ${analysis.specialty}`
  })
}
```

---

## 📈 Próximos Passos

### **Fase 1: Testes** ✅ (você está aqui)
- [x] Testar triagem via API
- [x] Testar resumo via API
- [x] Testar interface visual

### **Fase 2: Integração**
- [ ] Adicionar no formulário de criar demanda
- [ ] Adicionar na página de detalhes do paciente
- [ ] Testar com dados reais

### **Fase 3: Produção**
- [ ] Configurar rate limiting
- [ ] Adicionar logging/monitoring
- [ ] Criar dashboard de uso
- [ ] Coletar feedback dos usuários

---

## 📚 Recursos

- **OpenAI API Docs:** https://platform.openai.com/docs
- **GPT-4o-mini:** https://platform.openai.com/docs/models/gpt-4o-mini
- **Preços:** https://openai.com/api/pricing/
- **Playground:** https://platform.openai.com/playground

---

## 🎉 Conclusão

Você agora tem:
- ✅ Sistema de triagem inteligente funcionando
- ✅ Gerador de resumos médicos com IA
- ✅ Interface visual pronta para uso
- ✅ Custo ultra baixo (~R$ 0,0003 por análise)

**Próximo passo:** Teste agora em `http://localhost:3000/test-ai` 🚀
