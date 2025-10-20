# 🔧 Correção - Endpoints de Atribuição de Cargo

## ❌ Problema Identificado

O sistema estava usando endpoints incorretos:
- ❌ `POST /organizations/{slug}/members/{memberId}/job-title`
- ❌ `DELETE /organizations/{slug}/members/{memberId}/job-title`

## ✅ Solução Implementada

A API usa **DOIS endpoints separados** com método **PATCH**:

### 1. Atualizar Cargo
```
PATCH /organizations/{slug}/members/{memberId}/job-title
```
**Body:**
```json
{
  "jobTitleId": "uuid-do-cargo"
}
```

### 2. Atualizar Dias de Trabalho
```
PATCH /organizations/{slug}/members/{memberId}/working-days
```
**Body:**
```json
{
  "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
}
```

---

## 📁 Arquivos Corrigidos

### 1. `src/http/assign-job-title.ts` ✅
Agora faz **duas chamadas sequenciais**:
1. PATCH para atualizar o cargo
2. PATCH para atualizar os dias de trabalho

```typescript
// Primeiro, atualiza o cargo
await api.patch(`organizations/${org}/members/${memberId}/job-title`, {
  json: { jobTitleId: data.jobTitleId }
})

// Depois, atualiza os dias (se fornecidos)
if (data.workDays?.length > 0) {
  await api.patch(`organizations/${org}/members/${memberId}/working-days`, {
    json: { workingDays: data.workDays }
  })
}
```

### 2. `src/http/update-member-job-title.ts` ⭐ NEW
Função dedicada para atualizar **apenas o cargo**:
```typescript
updateMemberJobTitle(orgSlug, memberId, jobTitleId)
```

### 3. `src/http/update-member-working-days.ts` ⭐ NEW  
Função dedicada para atualizar **apenas os dias**:
```typescript
updateMemberWorkingDays(orgSlug, memberId, workingDays)
```

### 4. `src/http/remove-job-title.ts` ✅
Corrigido para usar PATCH com `jobTitleId: null`:
```typescript
await api.patch(`organizations/${org}/members/${memberId}/job-title`, {
  json: { jobTitleId: null }
})
```

---

## 🎯 Como Usar Agora

### Atribuir Cargo + Dias (Completo)
```typescript
import { assignJobTitleToMember } from '@/http/assign-job-title'

await assignJobTitleToMember('minha-org', 'user-123', {
  jobTitleId: 'job-456',
  workDays: ['monday', 'wednesday', 'friday']
})
// Faz 2 chamadas PATCH automaticamente
```

### Atualizar Apenas o Cargo
```typescript
import { updateMemberJobTitle } from '@/http/update-member-job-title'

await updateMemberJobTitle('minha-org', 'user-123', 'novo-cargo-789')
// Faz 1 chamada PATCH
```

### Atualizar Apenas os Dias
```typescript
import { updateMemberWorkingDays } from '@/http/update-member-working-days'

await updateMemberWorkingDays('minha-org', 'user-123', [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
])
// Faz 1 chamada PATCH
```

### Remover Cargo
```typescript
import { removeJobTitleFromMember } from '@/http/remove-job-title'

await removeJobTitleFromMember('minha-org', 'user-123')
// PATCH com jobTitleId: null
```

---

## 🔍 Logs de Debug

Agora os logs mostram informações detalhadas:
```typescript
console.error('❌ Error assigning job title:', {
  organizationSlug,
  memberId,
  data,
  error: error.message,
  status: error.response?.status,
  body: await error.response?.text?.()
})
```

---

## 🎨 UI - Mensagens de Erro Melhoradas

Os componentes agora mostram mensagens específicas:

| Status | Mensagem |
|--------|----------|
| 404 | ⚠️ Endpoint não encontrado. A API ainda não foi implementada. |
| 401 | 🔒 Não autorizado. Faça login novamente. |
| 400 | ❌ Dados inválidos. Verifique os campos. |
| 500 | 🔧 Erro no servidor. Contate o suporte. |
| Outros | Erro ao atribuir cargo: {mensagem} |

---

## 📊 Comparação: Antes vs Depois

### Antes ❌
```typescript
// POST (incorreto)
POST /organizations/minha-org/members/user-123/job-title
{
  "jobTitleId": "job-456",
  "workDays": ["monday", "tuesday"]
}
```

### Depois ✅
```typescript
// PATCH para cargo
PATCH /organizations/minha-org/members/user-123/job-title
{
  "jobTitleId": "job-456"
}

// PATCH para dias
PATCH /organizations/minha-org/members/user-123/working-days
{
  "workingDays": ["monday", "tuesday"]
}
```

---

## ✅ Checklist de Verificação

- [x] Método HTTP correto (PATCH, não POST)
- [x] Endpoints separados (job-title + working-days)
- [x] Payload correto para cada endpoint
- [x] Tratamento de erros detalhado
- [x] Logs informativos
- [x] Mensagens de erro amigáveis
- [x] Função para atualizar apenas cargo
- [x] Função para atualizar apenas dias
- [x] Função para remover cargo
- [x] Documentação atualizada

---

## 🧪 Testando

### 1. Abra o Console do Browser
```
F12 > Console
```

### 2. Tente Atribuir um Cargo
Veja os logs detalhados:
- Request URL
- Request Method (deve ser PATCH)
- Request Payload
- Response Status
- Response Body

### 3. Verifique os Erros
Se houver erro, você verá:
```
❌ Error assigning job title: {
  organizationSlug: "casa-do-autista",
  memberId: "user-123",
  data: { jobTitleId: "...", workDays: [...] },
  error: "...",
  status: 404,
  body: "..."
}
```

---

## 🎉 Resultado Esperado

Agora, quando você clicar em "Atribuir Cargo":

1. ✅ Primeira chamada PATCH para atualizar o cargo
2. ✅ Segunda chamada PATCH para atualizar os dias
3. ✅ Toast de sucesso
4. ✅ Lista de membros atualizada
5. ✅ Dialog fechado / Redirecionamento

---

## 📚 Referência da API

Conforme documentação oficial:

```
PATCH /organizations/{slug}/members/{memberId}/job-title
Atualizar cargo/função do membro

PATCH /organizations/{slug}/members/{memberId}/working-days
Atualizar dias de trabalho do membro
```

---

**Status**: ✅ Corrigido  
**Data**: 2025-10-19  
**Arquivos Modificados**: 4  
**Arquivos Criados**: 2
