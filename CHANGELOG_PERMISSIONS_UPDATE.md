# 📋 Changelog - Atualização do Sistema de Permissões

**Data:** 26 de outubro de 2025  
**Versão:** 2.0.0 - Sistema de Permissões e Auditoria

---

## 📦 **Novos Arquivos Criados**

### **1. `src/utils/demand-status-permissions.ts`** ✨
**Tipo:** Utilitário de validação de permissões  
**Linhas:** 104

**Funções exportadas:**
```typescript
// 1. Retorna array de status disponíveis para transição
export function getAvailableStatusTransitions(
  role: string,
  currentStatus: DemandStatusType
): DemandStatusType[]

// 2. Verifica se o role pode alterar o status atual
export function canChangeStatus(
  role: string,
  currentStatus: DemandStatusType
): boolean

// 3. Valida se pode fazer transição específica
export function canTransitionTo(
  role: string,
  currentStatus: DemandStatusType,
  newStatus: DemandStatusType
): boolean

// 4. Retorna mensagem de erro amigável
export function getTransitionErrorMessage(
  role: string,
  currentStatus: DemandStatusType,
  newStatus: DemandStatusType
): string
```

**Matriz de permissões implementada:**
- **ADMIN:** Pode alterar qualquer status para qualquer outro
- **MANAGER:** Pode alterar qualquer status para qualquer outro
- **CLERK:** 
  - PENDING → CHECK_IN, IN_PROGRESS, RESOLVED
  - CHECK_IN → IN_PROGRESS, RESOLVED
  - IN_PROGRESS → RESOLVED
- **ANALYST:** 
  - CHECK_IN → IN_PROGRESS, RESOLVED
  - IN_PROGRESS → RESOLVED
- **BILLING:** 
  - RESOLVED → BILLED

---

### **2. `src/hooks/use-demand-permissions.ts`** ✨
**Tipo:** React Hook para gerenciamento de permissões  
**Linhas:** 107

**Função exportada:**
```typescript
export function useDemandPermissions(
  demand: Demand | null | undefined,
  userRole: string,
  currentMemberId: string
): {
  canView: boolean
  canEdit: boolean
  canReassign: boolean
  availableStatuses: DemandStatusType[]
  accessDeniedMessage: string
}
```

**Funcionalidades:**
- ✅ **Validação LGPD:** ANALYST só vê suas próprias demands
- ✅ **canView:** Verifica se pode visualizar a demand
- ✅ **canEdit:** Verifica se pode editar a demand
- ✅ **canReassign:** Verifica se pode reatribuir para outro profissional
- ✅ **availableStatuses:** Lista de status disponíveis baseado no role
- ✅ **accessDeniedMessage:** Mensagem personalizada de acesso negado

**Regras de visualização (LGPD):**
- **ADMIN/MANAGER/CLERK/BILLING:** Veem todas as demands
- **ANALYST:** Vê APENAS demands atribuídas a si mesmo

---

### **3. `src/http/get-demand-history.ts`** ✨
**Tipo:** Cliente de API para histórico de auditoria  
**Linhas:** 85

**Funções exportadas:**
```typescript
// 1. Busca histórico de uma demand específica
export async function getDemandHistory(
  organizationSlug: string,
  unitSlug: string,
  demandId: string
): Promise<DemandStatusAuditLog[]>

// 2. Busca histórico de auditoria de um usuário
export async function getUserAuditHistory(
  organizationSlug: string,
  userId: string,
  limit?: number
): Promise<DemandStatusAuditLog[]>
```

**Interface retornada:**
```typescript
interface DemandStatusAuditLog {
  id: string
  demandId: string
  changedBy: string
  changedByName: string
  changedByRole: string
  previousStatus: string
  newStatus: string
  reason?: string
  changedAt: string
}
```

**Tratamento de erros:**
- ✅ Retorna array vazio se endpoint não existe (fallback)
- ✅ Retorna array vazio em caso de erro 404
- ✅ Lança erro para outros status codes

---

### **4. `src/components/demand-history.tsx`** ✨
**Tipo:** Componente React para visualização de histórico  
**Linhas:** 140

**Componente exportado:**
```typescript
export function DemandHistory({ 
  organizationSlug: string,
  unitSlug: string,
  demandId: string
}): JSX.Element
```

**Funcionalidades:**
- ✅ Timeline visual de mudanças de status
- ✅ Mostra usuário, role e timestamp de cada mudança
- ✅ Exibe motivo da mudança (se fornecido)
- ✅ Estados de loading e vazio
- ✅ Formatação em português (ex: "há 2 horas")
- ✅ Badges coloridos por tipo de status
- ✅ Ícones de usuário personalizados por role

**Dependências:**
- `@tanstack/react-query` para fetching
- `lucide-react` para ícones
- `date-fns` para formatação de datas

---

### **5. `src/components/demand-status-select.tsx`** ✨
**Tipo:** Componente React para seleção de status com permissões  
**Linhas:** 189

**Componente exportado:**
```typescript
export function DemandStatusSelect({ 
  demand: Demand,
  userRole: string,
  currentMemberId: string,
  organizationSlug: string,
  unitSlug: string,
  onStatusChange?: (newStatus: DemandStatusType) => void,
  showReasonField?: boolean
}): JSX.Element
```

**Funcionalidades:**
- ✅ Mostra apenas status permitidos para o role do usuário
- ✅ Campo de motivo opcional (para auditoria)
- ✅ Validação client-side antes de enviar
- ✅ Feedback visual de loading
- ✅ Notificações toast de sucesso/erro
- ✅ Atualização automática do cache do React Query
- ✅ Desabilitado automaticamente se usuário sem permissão
- ✅ Cores e ícones personalizados por status

**Estados tratados:**
- Loading durante atualização
- Sucesso com toast e atualização de cache
- Erro com mensagem específica do backend
- Desabilitado se sem permissões

---

## 🔧 **Arquivos Modificados**

### **1. `src/http/update-demand.ts`** ✏️
**Mudanças:**
```typescript
// ✅ ANTES
export interface UpdateDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandId: string
  title?: string
  description?: string
  priority?: string
  status?: string
}

// ✅ DEPOIS
export interface UpdateDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandId: string
  title?: string
  description?: string
  priority?: string
  status?: string
  reason?: string // ← NOVO: Motivo da mudança (auditoria)
}
```

**Impacto:**
- Campo `reason` agora enviado para o backend quando fornecido
- Backend registra o motivo na tabela `demand_status_audit_log`

---

### **2. `src/constants/role-translations.ts`** ✏️
**Mudanças:**
```typescript
// ✅ ANTES
export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'CLERK', label: 'Clerk' },
  { value: 'ANALYST', label: 'Analyst' },
  { value: 'BILLING', label: 'Billing' },
]

// ✅ DEPOIS
export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'MANAGER', label: 'Recursos Humanos' },
  { value: 'CLERK', label: 'Atendente' },
  { value: 'ANALYST', label: 'Profissional de Saúde' },
  { value: 'BILLING', label: 'Faturista' },
]
```

**Impacto:**
- Interface em português para contexto médico brasileiro
- Labels aparecem traduzidos em toda a aplicação

---

### **3. `src/http/index.ts`** ✏️
**Mudanças:**
```typescript
// ✅ Adicionado export
export * from './get-demand-history'
```

**Impacto:**
- API de histórico disponível para importação centralizada
- Facilita importação: `import { getDemandHistory } from '@/http'`

---

### **4. `src/app/(app)/org/[org]/unit/[unit]/my-agenda/quick-status-actions.tsx`** 🐛
**Mudanças:**
```typescript
// ✅ ANTES (causava erro de hidratação)
<AlertDialogDescription className="text-base pt-2">
  {pendingAction?.description}
  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
    <p className="text-sm text-slate-600">...</p>
  </div>
</AlertDialogDescription>

// ✅ DEPOIS (corrigido)
<div className="text-base pt-2 text-muted-foreground">
  <p>{pendingAction?.description}</p>
  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
    <p className="text-sm text-slate-600">...</p>
  </div>
</div>
```

**Impacto:**
- ✅ Corrige erro de hidratação React
- ✅ `<p>` não pode conter `<div>` ou `<p>` aninhados
- ✅ Substitui `AlertDialogDescription` por `<div>` simples

---

## 🎯 **Novas Rotas de API Integradas**

### **Backend (a implementar):**
```
GET /organizations/:slug/units/:unitSlug/demands/:id/history
- Retorna histórico de mudanças de status da demand
- Response: DemandStatusAuditLog[]

GET /organizations/:slug/users/:userId/audit-history?limit=50
- Retorna histórico de auditoria de um usuário específico
- Response: DemandStatusAuditLog[]
```

**Status:** ⏳ Frontend preparado com fallback (retorna array vazio se não existe)

---

## 📊 **Resumo das Funções por Categoria**

### **Validação de Permissões (4 funções):**
1. `getAvailableStatusTransitions()` - Lista status disponíveis
2. `canChangeStatus()` - Verifica permissão de mudança
3. `canTransitionTo()` - Valida transição específica
4. `getTransitionErrorMessage()` - Mensagens de erro

### **Hooks React (1 hook):**
1. `useDemandPermissions()` - Hook completo de permissões com LGPD

### **APIs HTTP (3 funções):**
1. `updateDemand()` - Modificada para incluir `reason`
2. `getDemandHistory()` - Nova: buscar histórico de demand
3. `getUserAuditHistory()` - Nova: buscar histórico de usuário

### **Componentes React (2 componentes):**
1. `<DemandHistory />` - Visualização de histórico
2. `<DemandStatusSelect />` - Seletor de status com permissões

---

## ✅ **Checklist de Implementação**

### **CONCLUÍDO ✅**
- [x] Criar sistema de validação de permissões de status
- [x] Implementar hook de permissões com LGPD
- [x] Adicionar campo `reason` no update de demands
- [x] Criar cliente de API para histórico de auditoria
- [x] Criar componente de visualização de histórico
- [x] Criar seletor de status com permissões
- [x] Traduzir roles para português
- [x] Corrigir erro de hidratação React
- [x] Exportar novas APIs no index
- [x] Documentar todas as mudanças

### **PENDENTE (Aplicação nos Componentes) 🔜**
- [ ] Integrar `DemandStatusSelect` em páginas de demand
- [ ] Adicionar `DemandHistory` em detalhes de demand
- [ ] Atualizar lista de demands com permissões
- [ ] Adicionar tratamento de erro 401
- [ ] Testar com diferentes roles

---

## 🧪 **Como Testar**

### **1. Testar Permissões de Status**
```bash
# Como ANALYST (médico)
- Login como profissional de saúde
- Verificar que só vê demands atribuídas a você
- Tentar mudar status: CHECK_IN → IN_PROGRESS (deve funcionar)
- Tentar mudar status para BILLED (não deve aparecer a opção)
```

### **2. Testar Histórico**
```typescript
import { DemandHistory } from '@/components/demand-history'

<DemandHistory
  organizationSlug="my-org"
  unitSlug="my-unit"
  demandId="demand-123"
/>
```

### **3. Testar Seletor de Status**
```typescript
import { DemandStatusSelect } from '@/components/demand-status-select'

<DemandStatusSelect
  demand={demand}
  userRole="ANALYST"
  currentMemberId="member-123"
  organizationSlug="my-org"
  unitSlug="my-unit"
  showReasonField={true}
/>
```

---

## 📚 **Arquivos de Referência**

- **Guia Completo:** `FRONTEND_UPDATE_GUIDE.md`
- **Este Changelog:** `CHANGELOG_PERMISSIONS_UPDATE.md`
- **Roles e Permissões:** `ROLES_E_PERMISSOES.md`
- **Backend Guide:** Documentação fornecida (246 testes passando)

---

## 🚀 **Próximos Passos**

1. **Integrar componentes** nas páginas existentes
2. **Implementar endpoints de histórico** no backend
3. **Testar com usuários reais** de cada role
4. **Adicionar métricas** de auditoria para ADMIN
5. **Criar dashboard** de compliance LGPD

---

**Última atualização:** 26 de outubro de 2025  
**Total de arquivos criados:** 5  
**Total de arquivos modificados:** 4  
**Total de funções novas:** 10  
**Total de componentes novos:** 2
