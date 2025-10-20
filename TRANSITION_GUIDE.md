# 🔄 Guia de Transição: Dados Mockados → API Real

## ✅ Status Atual: API REAL ATIVA

**Data da transição:** 19 de outubro de 2025  
**Modo anterior:** Desenvolvimento (Mockado)  
**Modo atual:** Produção (API Real)

---

## 📋 O que mudou?

### Antes (Mockado)
```typescript
// useJobTitles retornava:
{
  jobTitles: [
    { id: 'job-1', name: 'Médico', ... },
    { id: 'job-2', name: 'Psicólogo', ... },
    { id: 'job-3', name: 'Enfermeiro', ... },
    { id: 'job-4', name: 'Fisioterapeuta', ... },
  ]
}

// useAvailability retornava:
{
  members: [
    { 
      memberId: 'member-1', 
      memberName: 'Dr. João Silva',
      availability: [...] // Dados simulados
    },
    ...
  ]
}
```

### Agora (API Real)
```typescript
// useJobTitles busca de:
GET https://equipe-ativa-1498a5a916b7.herokuapp.com/organizations/{org}/job-titles

// useAvailability busca de:
GET https://equipe-ativa-1498a5a916b7.herokuapp.com/organizations/{org}/units/{unit}/members/availability
```

---

## 🎯 Arquivos Modificados

### 1. `src/hooks/use-job-titles.ts`
**Mudança:** Query agora chama `getJobTitles()` da API

**Antes:**
```typescript
queryFn: async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return generateMockJobTitles()
}
```

**Depois:**
```typescript
queryFn: () => getJobTitles(organizationSlug)
```

### 2. `src/hooks/use-availability.ts`
**Mudança:** Query agora chama `getMemberAvailability()` da API

**Antes:**
```typescript
queryFn: async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return generateMockAvailability()
}
```

**Depois:**
```typescript
queryFn: () => getMemberAvailability({
  organizationSlug,
  unitSlug,
  jobTitleId: jobTitleId!,
  startDate,
  endDate,
})
```

---

## ⚡ Impactos na Aplicação

### ✅ Funcionalidades Mantidas
- Interface visual (sem mudanças)
- Fluxo de usuário (sem mudanças)
- Componentes (JobTitleSelector, TimeSlotGrid)
- Navegação de semanas
- Seleção de slots
- Validações de formulário

### 🔄 Funcionalidades Alteradas
- **Fonte de dados:** Agora vem do backend
- **Velocidade:** Pode variar conforme rede/servidor
- **Disponibilidade:** Depende de configurações reais
- **Erros:** Podem acontecer (401, 404, 500, etc.)

### ⚠️ Novos Cenários Possíveis
- Lista de cargos vazia (se não houver cargos cadastrados)
- Sem disponibilidade (se membros não tiverem cargo atribuído)
- Erros de autenticação (token expirado)
- Erros de rede (timeout, servidor offline)
- Cold start do Heroku (primeira requisição lenta)

---

## 🔍 Como Testar a Transição

### Passo 1: Verificar Job Titles
```bash
1. Acesse a página de criação de demanda
2. Abra DevTools (F12) → Network
3. Procure por: job-titles
4. Verifique Response:
   - Status: 200 OK ✅
   - Body: Array de cargos
```

**Se der erro:**
- 401: Faça login novamente
- 404: Endpoint não existe
- 500: Erro no servidor

### Passo 2: Verificar Availability
```bash
1. Selecione um cargo
2. DevTools → Network
3. Procure por: availability
4. Verifique Response:
   - Status: 200 OK ✅
   - Body: Array de membros com availability
```

**Se der erro:**
- 401: Faça login novamente
- 400: Parâmetros inválidos (jobTitleId, dates)
- 404: Endpoint não existe
- 500: Erro no servidor

### Passo 3: Testar Fluxo Completo
```bash
1. Preencher título e descrição
2. Selecionar cargo → Deve carregar agenda
3. Navegar entre semanas → Deve funcionar
4. Clicar em slot verde → Deve selecionar
5. Submeter formulário → Deve processar
```

---

## 📊 Comparativo: Mock vs Real

| Aspecto | Mock (Antes) | Real (Agora) |
|---------|--------------|--------------|
| **Velocidade** | Instantâneo | Depende da rede |
| **Dados** | Fixos (4 cargos, 3 membros) | Dinâmicos (banco real) |
| **Disponibilidade** | Sempre funcionando | Pode ter downtime |
| **Erros** | Nunca | Podem ocorrer |
| **Autenticação** | Não necessária | Obrigatória |
| **Cache** | 5 minutos | 5 minutos |
| **Desenvolvimento** | Ideal | Menos ideal |
| **Produção** | Não adequado | Perfeito |

---

## 🛠️ Troubleshooting

### Problema 1: "Nenhum cargo disponível"

**Possíveis Causas:**
1. Nenhum cargo foi cadastrado na organização
2. Erro de autenticação (401)
3. Problema de rede
4. Servidor offline

**Solução:**
```bash
# Verificar no console
Network → job-titles → Response

# Se status 200 mas array vazio:
→ Cadastre cargos em /org/{org}/job-titles

# Se status 401:
→ Faça logout e login novamente

# Se status 500:
→ Verifique logs do Heroku
```

### Problema 2: "Nenhum horário disponível"

**Possíveis Causas:**
1. Membros não têm cargo atribuído
2. Membros não têm working days configurados
3. Período de busca sem disponibilidade
4. Erro na API

**Solução:**
```bash
# Verificar no console
Network → availability → Response

# Se status 200 mas array vazio:
→ Atribua cargos aos membros
→ Configure working days

# Se status 400:
→ Verifique parâmetros (jobTitleId, dates)

# Se status 500:
→ Verifique logs do Heroku
```

### Problema 3: Carregamento muito lento

**Possíveis Causas:**
1. Heroku cold start (dyno dormindo)
2. Rede lenta
3. Backend processando muito

**Solução:**
```bash
# Primeira requisição pode demorar até 30s
→ Aguarde ou faça ping no servidor antes

# Se sempre lento:
→ Otimize queries do backend
→ Adicione índices no banco
→ Considere cache no servidor
```

### Problema 4: Erro CORS

**Sintoma:**
```
Access to fetch blocked by CORS policy
```

**Solução:**
```bash
→ Backend precisa configurar CORS headers
→ Adicionar domínio do frontend na whitelist
```

---

## 🔙 Como Voltar para Modo Mockado

Se precisar voltar temporariamente:

### Opção 1: Reverter Código

Em `src/hooks/use-job-titles.ts`:
```typescript
// Comentar:
const { data, isLoading, error } = useQuery({
  queryFn: () => getJobTitles(organizationSlug),
  // ...
})

// Descomentar:
const { data, isLoading, error } = useQuery({
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateMockJobTitles()
  },
  // ...
})
```

Fazer o mesmo em `src/hooks/use-availability.ts`

### Opção 2: Feature Flag

Criar variável de ambiente:
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Modificar hooks:
```typescript
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

const { data, isLoading, error } = useQuery({
  queryFn: useMock 
    ? async () => generateMockJobTitles()
    : () => getJobTitles(organizationSlug),
})
```

---

## 📈 Próximos Passos

### Imediato
1. ✅ Monitorar erros no console
2. ✅ Verificar performance
3. ✅ Validar dados retornados
4. ✅ Testar casos extremos

### Curto Prazo
1. ⏳ Implementar tratamento de erros específicos
2. ⏳ Adicionar retry automático
3. ⏳ Melhorar feedback de loading
4. ⏳ Adicionar logs de analytics

### Médio Prazo
1. 📅 Otimizar cache strategy
2. 📅 Implementar prefetching
3. 📅 Adicionar error boundary
4. 📅 Melhorar UX de erros

---

## ✅ Checklist de Validação

Antes de considerar transição completa:

- [ ] Backend está estável
- [ ] Todos os endpoints respondem 200 OK
- [ ] Há cargos cadastrados para teste
- [ ] Há membros com cargos atribuídos
- [ ] Working days configurados
- [ ] Testado criar demanda completa
- [ ] Erros são tratados adequadamente
- [ ] Performance aceitável
- [ ] CORS configurado corretamente
- [ ] Logs funcionando
- [ ] Monitoramento ativo

---

## 📞 Suporte

Caso encontre problemas:

1. **Console do Navegador (F12)**
   - Tab Console: Erros JavaScript
   - Tab Network: Requisições HTTP

2. **Logs do Heroku**
   ```bash
   heroku logs --tail --app equipe-ativa-1498a5a916b7
   ```

3. **Documentação**
   - `API_REAL_ACTIVATED.md` - Status e troubleshooting
   - `SCHEDULING_SYSTEM.md` - Documentação técnica
   - `MOCK_DATA_GUIDE.md` - Como voltar para mocks

---

**Transição realizada em:** 19 de outubro de 2025  
**Status:** ✅ Completa  
**Modo:** 🟢 Produção (API Real)  
**Rollback:** Disponível se necessário
