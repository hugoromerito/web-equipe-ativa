# ✅ API Real Ativada - Sistema de Agendamento

## 🔄 Mudança Realizada

**Data:** 19 de outubro de 2025  
**Status:** ✅ Modo Produção Ativado

### O que mudou?

Os dados **mockados (simulados)** foram **desativados** e o sistema agora consome a **API real**:

```
🟡 ANTES: Dados Mockados (desenvolvimento)
    ↓
🟢 AGORA: API Real (produção)
```

## 🔌 Endpoints Ativos

### 1. Job Titles (Cargos)
```
GET /organizations/{organizationSlug}/job-titles
```
**Hook:** `useJobTitles(organizationSlug)`  
**Arquivo:** `src/hooks/use-job-titles.ts`

### 2. Member Availability (Disponibilidade)
```
GET /organizations/{organizationSlug}/units/{unitSlug}/members/availability
Query Params:
  - jobTitleId: string
  - startDate: yyyy-MM-dd
  - endDate: yyyy-MM-dd
```
**Hook:** `useAvailability({ organizationSlug, unitSlug, jobTitleId })`  
**Arquivo:** `src/hooks/use-availability.ts`

## 🌐 API Base URL

```
https://equipe-ativa-1498a5a916b7.herokuapp.com
```

Configurada em: `src/config/env.ts` via `NEXT_PUBLIC_API_URL`

## 🎯 O que esperar agora?

### Dados Reais
- ✅ Cargos cadastrados na sua organização
- ✅ Disponibilidade real dos membros
- ✅ Horários baseados em working days configurados
- ✅ Integração completa com o backend

### Possíveis Cenários

#### ✅ Cenário 1: Tudo funcionando
- Cargos aparecem normalmente
- Agenda carrega com horários reais
- Seleção e submissão funcionam

#### ⚠️ Cenário 2: Nenhum cargo aparece
**Causa:** Nenhum cargo cadastrado na organização  
**Solução:** Acesse `/org/{org}/job-titles` e crie alguns cargos

#### ⚠️ Cenário 3: Nenhum horário disponível
**Causa:** Membros não têm job-title atribuído ou working days configurados  
**Solução:** 
1. Atribua cargos aos membros em `/org/{org}/members`
2. Configure working days de cada membro

#### ❌ Cenário 4: Erro 401 (Unauthorized)
**Causa:** Token de autenticação inválido ou expirado  
**Solução:** Faça logout e login novamente

#### ❌ Cenário 5: Erro 404 (Not Found)
**Causa:** Endpoint não existe ou rota incorreta  
**Solução:** Verifique se a API implementou os endpoints necessários

#### ❌ Cenário 6: Erro 500 (Server Error)
**Causa:** Erro no backend  
**Solução:** Verifique logs do servidor Heroku

## 🔍 Como Verificar

### 1. Abrir DevTools (F12)
```javascript
// Console do navegador
// Você verá as chamadas sendo feitas
```

### 2. Network Tab
```
Filtrar por: XHR
Procurar por:
  - job-titles
  - availability
```

### 3. Verificar Response
```json
// Job Titles
{
  "jobTitles": [
    {
      "id": "uuid",
      "name": "Médico",
      "description": "...",
      "organizationId": "uuid",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

// Availability
{
  "members": [
    {
      "memberId": "uuid",
      "memberName": "Dr. João Silva",
      "avatarUrl": "...",
      "email": "...",
      "availability": [
        {
          "memberId": "uuid",
          "memberName": "...",
          "date": "2025-10-20",
          "startTime": "08:00",
          "endTime": "08:30",
          "isAvailable": true
        }
      ]
    }
  ]
}
```

## 🐛 Troubleshooting

### Problema: "Nenhum cargo disponível"

**Debug:**
```javascript
// Console do navegador
// Verificar se a chamada foi feita
Network → XHR → job-titles → Response
```

**Soluções:**
1. Verificar se organizationSlug está correto
2. Confirmar que há cargos cadastrados
3. Verificar token de autenticação
4. Checar permissões do usuário

### Problema: "Nenhum profissional disponível"

**Debug:**
```javascript
// Console do navegador
Network → XHR → availability → Response
```

**Soluções:**
1. Verificar se jobTitleId está sendo enviado
2. Confirmar que há membros com esse cargo
3. Validar que membros têm working days configurados
4. Checar range de datas (startDate/endDate)

### Problema: Erros de CORS

**Sintoma:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solução:**
- Backend precisa configurar CORS headers
- Verificar se domínio do frontend está na whitelist

### Problema: Timeout

**Sintoma:**
```
TimeoutError: Request timed out after 30000ms
```

**Soluções:**
1. Backend pode estar lento (Heroku cold start)
2. Aumentar timeout em `api-client.ts`
3. Verificar se API está respondendo

## 🔄 Como Voltar para Dados Mockados

Se precisar voltar para testes locais:

### 1. Em `src/hooks/use-job-titles.ts`

Comentar código de produção e descomentar código de desenvolvimento:

```typescript
// Comentar isto:
const { data, isLoading, error } = useQuery({
  queryKey: ['job-titles', organizationSlug],
  queryFn: () => getJobTitles(organizationSlug),
  enabled: !!organizationSlug,
})

// Descomentar isto:
/*
const { data, isLoading, error } = useQuery({
  queryKey: ['job-titles', organizationSlug],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateMockJobTitles()
  },
  enabled: !!organizationSlug,
})
*/
```

### 2. Em `src/hooks/use-availability.ts`

Fazer o mesmo processo:

```typescript
// Comentar código de produção
// Descomentar código de desenvolvimento
```

## 📊 Monitoramento

### Métricas Importantes

1. **Tempo de Resposta**
   - Job Titles: < 500ms esperado
   - Availability: < 1000ms esperado

2. **Taxa de Erro**
   - Objetivo: < 1%
   - Monitore 401, 403, 404, 500

3. **Cache**
   - React Query cache: 5 minutos
   - Revalida automaticamente

## ✅ Checklist de Verificação

Antes de usar em produção, verifique:

- [ ] Backend está rodando
- [ ] Endpoints implementados (/job-titles e /availability)
- [ ] CORS configurado
- [ ] Autenticação funcionando
- [ ] Pelo menos 1 cargo cadastrado
- [ ] Pelo menos 1 membro com cargo atribuído
- [ ] Working days configurados para membros
- [ ] Testado em ambiente de staging
- [ ] Logs de erro funcionando
- [ ] Performance aceitável

## 📝 Notas Importantes

1. **Cache:** Sistema usa cache de 5 minutos. Se fizer alterações no backend, pode demorar até 5 minutos para refletir.

2. **Autenticação:** Se usuário ficar muito tempo sem usar, token pode expirar e causar erro 401.

3. **Heroku Cold Start:** Primeira requisição pode demorar mais (até 30s) se dyno estava dormindo.

4. **Rate Limiting:** Se houver muitas requisições, backend pode bloquear temporariamente.

## 🎉 Próximos Passos

Agora que a API real está ativa:

1. **Teste o fluxo completo:**
   - Criar cargo
   - Atribuir cargo a membro
   - Configurar working days
   - Criar demanda com agendamento

2. **Monitore erros:**
   - Console do navegador
   - Network tab
   - Logs do backend

3. **Otimize se necessário:**
   - Ajuste cache
   - Implemente retry logic
   - Adicione loading states

4. **Documente comportamentos:**
   - Casos de sucesso
   - Casos de erro
   - Edge cases

---

## 📞 Suporte

Caso encontre problemas:

1. Verifique logs do navegador (F12)
2. Verifique logs do Heroku
3. Consulte documentação da API
4. Verifique este documento

---

**Atualizado em:** 19 de outubro de 2025  
**Status:** 🟢 API Real Ativa  
**Modo:** Produção
