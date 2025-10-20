# ✅ API Real Reativada

**Data**: 19 de outubro de 2025  
**Status**: PRODUÇÃO - Usando endpoints reais

---

## 🔄 Mudanças Aplicadas

Os dados mockados foram **DESATIVADOS** e o sistema agora está consumindo a API real do Heroku.

### Arquivos Modificados:

#### 1. `src/hooks/use-job-titles.ts`
- ✅ API real ativada: `getJobTitles(organizationSlug)`
- ⚪ Mock desativado (comentado)

#### 2. `src/hooks/use-availability.ts`  
- ✅ API real ativada: `getMemberAvailability(...)`
- ⚪ Mock desativado (comentado)

---

## 🌐 Endpoints Sendo Consumidos

### 1. Job Titles
```
GET https://equipe-ativa-1498a5a916b7.herokuapp.com/organizations/{org}/job-titles
```

### 2. Member Availability
```
GET https://equipe-ativa-1498a5a916b7.herokuapp.com/organizations/{org}/units/{unit}/members/availability
Params: jobTitleId, startDate, endDate
```

---

## ⚠️ Possíveis Problemas

Se os endpoints ainda não estiverem implementados no backend, você verá:

### Erro 404 - Not Found
```
O endpoint não existe ou a rota está incorreta
```

### Erro 500 - Internal Server Error
```
O endpoint existe mas há erro no processamento
```

### Erro 401 - Unauthorized
```
Token de autenticação inválido ou expirado
```

---

## 🔧 Troubleshooting

### 1. Verificar se endpoints existem

Abra o DevTools (F12) → Network tab

Procure por:
- `job-titles` (Status esperado: 200)
- `availability` (Status esperado: 200)

### 2. Verificar resposta da API

Clique na requisição → Preview/Response

Deve retornar JSON no formato esperado:

**Job Titles:**
```json
{
  "jobTitles": [
    {
      "id": "uuid",
      "name": "Médico",
      "description": "...",
      "organizationId": "uuid",
      "createdAt": "2025-10-19T...",
      "updatedAt": "2025-10-19T..."
    }
  ]
}
```

**Availability:**
```json
{
  "members": [
    {
      "memberId": "uuid",
      "memberName": "Dr. João Silva",
      "avatarUrl": null,
      "email": "joao@email.com",
      "availability": [
        {
          "memberId": "uuid",
          "memberName": "Dr. João Silva",
          "date": "2025-10-19",
          "startTime": "08:00",
          "endTime": "08:30",
          "isAvailable": true
        }
      ]
    }
  ]
}
```

### 3. Se der erro 404

Os endpoints ainda não foram implementados. Você tem 2 opções:

**Opção A**: Aguardar implementação do backend

**Opção B**: Reativar dados mockados temporariamente

Para reativar os mocks, consulte `MOCK_DATA_ACTIVATED.md`

---

## 🔄 Como Voltar para Dados Mockados

Se a API estiver com problemas e você quiser voltar aos dados de exemplo:

### Passo 1: Editar `use-job-titles.ts`

Comentar:
```typescript
// ✅ PRODUÇÃO: Usando API real
const { data, isLoading, error } = useQuery({
  queryKey: ['job-titles', organizationSlug],
  queryFn: () => getJobTitles(organizationSlug),
  enabled: !!organizationSlug,
})
```

Descomentar:
```typescript
// DESENVOLVIMENTO: Dados mockados
const { data, isLoading, error } = useQuery({
  queryKey: ['job-titles', organizationSlug],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateMockJobTitles()
  },
  enabled: !!organizationSlug,
})
```

### Passo 2: Editar `use-availability.ts`

Comentar:
```typescript
// ✅ PRODUÇÃO: Usando API real
return useQuery({
  queryKey: ['member-availability', organizationSlug, unitSlug, jobTitleId, startDate, endDate],
  queryFn: () => getMemberAvailability({...}),
  enabled: enabled && !!jobTitleId,
  staleTime: 1000 * 60 * 5,
})
```

Descomentar:
```typescript
// DESENVOLVIMENTO: Dados mockados
return useQuery({
  queryKey: ['member-availability', organizationSlug, unitSlug, jobTitleId, startDate, endDate],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return generateMockAvailability()
  },
  enabled: enabled && !!jobTitleId,
  staleTime: 1000 * 60 * 5,
})
```

---

## 📊 Monitoramento

### Console Warnings

**Com API Real (atual):**
- Nenhum warning sobre mocks
- Apenas logs normais do React Query

**Com Mocks:**
- `⚠️ Usando dados mockados - Endpoint /job-titles com problemas no backend`
- `⚠️ Usando dados mockados - Endpoint /members/availability ainda não implementado no backend`

### Network Tab

**Requisições esperadas:**
1. `GET .../job-titles` → 200 OK
2. `GET .../members/availability?jobTitleId=...&startDate=...&endDate=...` → 200 OK

---

## 📝 Checklist de Validação

Após ativar a API real, verifique:

- [ ] Página de criação de demanda carrega sem erros
- [ ] Lista de cargos aparece (dados reais do banco)
- [ ] Ao selecionar cargo, agenda carrega
- [ ] Membros reais aparecem na agenda
- [ ] Horários disponíveis estão corretos
- [ ] Possível selecionar horários
- [ ] Possível navegar entre semanas
- [ ] Botão "Registrar Consulta" funciona

---

## 🆘 Suporte

Se encontrar erros:

1. **Verifique o console** (F12 → Console)
2. **Verifique a Network tab** (F12 → Network)
3. **Copie o erro completo**
4. **Informe ao time de backend** se for erro 404/500

---

## 📚 Documentação Relacionada

- `SCHEDULING_SYSTEM.md` - Documentação técnica completa
- `MOCK_DATA_ACTIVATED.md` - Como ativar dados mockados
- `API_REAL_ACTIVATED.md` - Troubleshooting da API real
- `TRANSITION_GUIDE.md` - Guia de transição mock ↔ real

---

**Status Atual**: ✅ Usando API REAL  
**Compilação**: ✅ Zero erros  
**Pronto para**: Testes com dados reais do banco de dados
