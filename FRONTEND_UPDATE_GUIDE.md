# 🔄 Frontend Atualizado - Sistema de Permissões e Auditoria

**Data:** 26 de outubro de 2025  
**Status:** ✅ Implementações concluídas  
**Backend:** ✅ 100% dos testes passando (246/246)

---

## ✅ **O que Foi Implementado**

### **1. Utilitário de Permissões de Status**
📁 `src/utils/demand-status-permissions.ts`

**Funcionalidades:**
- ✅ `getAvailableStatusTransitions(role, currentStatus)` - Retorna status disponíveis
- ✅ `canChangeStatus(role, currentStatus)` - Verifica se pode alterar status
- ✅ `canTransitionTo(role, currentStatus, newStatus)` - Valida transição específica
- ✅ `getTransitionErrorMessage(...)` - Mensagens de erro amigáveis

**Exemplo de uso:**
```typescript
import { getAvailableStatusTransitions } from '@/utils/demand-status-permissions'

const availableStatuses = getAvailableStatusTransitions('ANALYST', 'CHECK_IN')
// Retorna: ['IN_PROGRESS', 'RESOLVED']
```

---

### **2. Hook de Permissões de Demands**
📁 `src/hooks/use-demand-permissions.ts`

**Funcionalidades:**
- ✅ Valida LGPD: ANALYST só vê suas próprias demands
- ✅ Verifica permissões de visualização (`canView`)
- ✅ Verifica permissões de edição (`canEdit`)
- ✅ Verifica permissões de reatribuição (`canReassign`)
- ✅ Retorna status disponíveis (`availableStatuses`)
- ✅ Mensagens de erro personalizadas

**Exemplo de uso:**
```typescript
import { useDemandPermissions } from '@/hooks/use-demand-permissions'

const { 
  canView, 
  canEdit, 
  availableStatuses,
  accessDeniedMessage 
} = useDemandPermissions(demand, userRole, currentMemberId)

if (!canView) {
  return <div>{accessDeniedMessage}</div>
}
```

---

### **3. API de Histórico de Auditoria**
📁 `src/http/get-demand-history.ts`

**Funcionalidades:**
- ✅ `getDemandHistory(orgSlug, unitSlug, demandId)` - Busca histórico da demand
- ✅ `getUserAuditHistory(orgSlug, userId, limit)` - Busca histórico do usuário
- ✅ Tratamento de erros (retorna array vazio se endpoint não existe)

**Exemplo de uso:**
```typescript
import { getDemandHistory } from '@/http/get-demand-history'

const history = await getDemandHistory('my-org', 'my-unit', 'demand-123')
// Retorna array de DemandStatusAuditLog
```

---

### **4. Componente de Histórico**
📁 `src/components/demand-history.tsx`

**Funcionalidades:**
- ✅ Timeline visual de mudanças
- ✅ Mostra usuário, role e timestamp
- ✅ Exibe motivo da mudança (se fornecido)
- ✅ Loading e estados vazios
- ✅ Formatação em português

**Exemplo de uso:**
```tsx
import { DemandHistory } from '@/components/demand-history'

<DemandHistory 
  organizationSlug="my-org"
  unitSlug="my-unit"
  demandId="demand-123"
/>
```

---

### **5. Seletor de Status com Permissões**
📁 `src/components/demand-status-select.tsx`

**Funcionalidades:**
- ✅ Mostra apenas status permitidos por role
- ✅ Campo de motivo opcional
- ✅ Validação client-side antes de enviar
- ✅ Feedback visual de loading e erros
- ✅ Atualização automática de cache
- ✅ Desabilitado automaticamente se sem permissão

**Exemplo de uso:**
```tsx
import { DemandStatusSelect } from '@/components/demand-status-select'

<DemandStatusSelect
  demand={demand}
  userRole={userRole}
  currentMemberId={currentMemberId}
  organizationSlug="my-org"
  unitSlug="my-unit"
  onStatusChange={(newStatus) => console.log('Mudou para:', newStatus)}
  showReasonField={true}
/>
```

---

### **6. Atualização do update-demand.ts**
📁 `src/http/update-demand.ts`

**Mudanças:**
- ✅ Adicionado campo `reason?: string` no UpdateDemandRequest
- ✅ Campo enviado para auditoria no backend

---

## 🎯 **Como Integrar nos Componentes Existentes**

### **Exemplo 1: Atualizar Lista de Demands**

```tsx
// src/app/(app)/org/[org]/unit/[unit]/demands/demand-list.tsx

import { useDemandPermissions } from '@/hooks/use-demand-permissions'

function DemandCard({ demand, userRole, currentMemberId }) {
  const { canView, canEdit } = useDemandPermissions(
    demand,
    userRole,
    currentMemberId
  )

  if (!canView) {
    return null // ANALYST não vê demands de outros
  }

  return (
    <div className="demand-card">
      <h3>{demand.title}</h3>
      
      {canEdit ? (
        <DemandStatusSelect
          demand={demand}
          userRole={userRole}
          currentMemberId={currentMemberId}
          organizationSlug={organizationSlug}
          unitSlug={unitSlug}
        />
      ) : (
        <BadgeDemand status={demand.status} />
      )}
    </div>
  )
}
```

---

### **Exemplo 2: Adicionar Histórico na Página de Detalhes**

```tsx
// src/app/(app)/org/[org]/unit/[unit]/demands/[demand]/demand-details.tsx

import { DemandHistory } from '@/components/demand-history'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export async function DemandDetails() {
  // ... código existente

  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {/* Conteúdo existente */}
        </TabsContent>

        <TabsContent value="history">
          <DemandHistory
            organizationSlug={currentOrg}
            unitSlug={currentUnit}
            demandId={demand.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

### **Exemplo 3: Atualizar Drawer de Status**

```tsx
// src/app/(app)/org/[org]/unit/[unit]/demands/[demand]/drawer-demand-status.tsx

import { DemandStatusSelect } from '@/components/demand-status-select'
import { useDemandPermissions } from '@/hooks/use-demand-permissions'

export function DrawerDemandStatus({ demand, userRole, currentMemberId }) {
  const { canEdit, availableStatuses } = useDemandPermissions(
    demand,
    userRole,
    currentMemberId
  )

  if (!canEdit || availableStatuses.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Você não tem permissão para alterar este status
        </p>
      </div>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Alterar Status</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Atualizar Status</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <DemandStatusSelect
            demand={demand}
            userRole={userRole}
            currentMemberId={currentMemberId}
            organizationSlug={organizationSlug}
            unitSlug={unitSlug}
            showReasonField={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

---

### **Exemplo 4: Tratamento de Erros 401**

```tsx
// src/app/(app)/org/[org]/unit/[unit]/demands/[demand]/page.tsx

import { redirect } from 'next/navigation'
import { useDemandPermissions } from '@/hooks/use-demand-permissions'

export default async function DemandPage({ params }) {
  try {
    const demand = await getDemand(params.org, params.unit, params.demand)
    const userRole = await getCurrentUserRole()
    const currentMemberId = await getCurrentMemberId()

    const { canView, accessDeniedMessage } = useDemandPermissions(
      demand,
      userRole,
      currentMemberId
    )

    if (!canView) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">{accessDeniedMessage}</p>
          <Button onClick={() => redirect(`/org/${params.org}/unit/${params.unit}/demands`)}>
            Voltar para Demands
          </Button>
        </div>
      )
    }

    return <DemandDetails demand={demand} />
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirect(`/org/${params.org}/unit/${params.unit}/demands?error=access-denied`)
    }
    throw error
  }
}
```

---

## 📋 **Checklist de Atualização**

### **CRÍTICO 🔴 - Já Implementado**
- [x] Criar utilitário de permissões (`demand-status-permissions.ts`)
- [x] Criar hook de permissões (`use-demand-permissions.ts`)
- [x] Atualizar `update-demand.ts` com campo `reason`
- [x] Criar API de histórico (`get-demand-history.ts`)
- [x] Criar componente de histórico (`demand-history.tsx`)
- [x] Criar seletor de status (`demand-status-select.tsx`)

### **ALTA 🟡 - Aplicar nos Componentes**
- [ ] Atualizar `demand-list.tsx` para usar permissões
- [ ] Atualizar `demand-details.tsx` para mostrar histórico
- [ ] Atualizar `drawer-demand-status.tsx` para usar novo seletor
- [ ] Adicionar tratamento de erro 401 nas páginas
- [ ] Atualizar `quick-status-actions.tsx` com permissões

### **MÉDIA 🟢 - Melhorias**
- [ ] Adicionar aba de histórico nos detalhes
- [ ] Mostrar indicador visual "Suas Demands" para ANALYST
- [ ] Criar filtro "Minhas Demands" na lista
- [ ] Adicionar tooltip explicando permissões

### **OPCIONAL ✨**
- [ ] Dashboard de auditoria para ADMIN
- [ ] Notificações de mudanças de status
- [ ] Exportar relatório de histórico
- [ ] Métricas de tempo entre mudanças de status

---

## 🧪 **Como Testar**

### **Teste 1: Permissões de ANALYST**
1. Faça login como ANALYST (médico)
2. Vá para lista de demands
3. **Esperado:** Ver apenas demands atribuídas a você
4. Tente acessar URL de demand de outro médico
5. **Esperado:** Mensagem de acesso negado

### **Teste 2: Transições de Status**
1. Faça login como CLERK
2. Abra uma demand com status PENDING
3. Clique em "Alterar Status"
4. **Esperado:** Ver opções CHECK_IN, IN_PROGRESS, RESOLVED
5. Tente mudar para BILLED
6. **Esperado:** BILLED não aparece (apenas BILLING pode)

### **Teste 3: Campo de Motivo**
1. Faça login como ADMIN
2. Altere status de uma demand
3. Digite um motivo no campo opcional
4. Salve a mudança
5. Abra aba "Histórico"
6. **Esperado:** Ver motivo registrado

### **Teste 4: Histórico de Auditoria**
1. Faça várias mudanças de status em uma demand
2. Abra a aba "Histórico"
3. **Esperado:** Ver timeline com todas as mudanças
4. **Esperado:** Nome do usuário, role, timestamp e motivo

---

## 🔌 **Endpoints do Backend (Referência)**

### **Já Existentes:**
- ✅ `GET /organizations/:slug/units/:unitSlug/demands` - Filtra automaticamente para ANALYST
- ✅ `GET /organizations/:slug/units/:unitSlug/demands/:id` - Retorna 401 se ANALYST sem acesso
- ✅ `PATCH /organizations/:slug/units/:unitSlug/demands/:id` - Valida permissões e transições

### **A Implementar no Backend:**
- ⏳ `GET /organizations/:slug/units/:unitSlug/demands/:id/history` - Buscar histórico
- ⏳ `GET /organizations/:slug/users/:userId/audit-history` - Histórico do usuário

**Nota:** Os endpoints de histórico têm fallback (retornam array vazio se não existirem ainda)

---

## 💡 **Boas Práticas**

### **1. Sempre Validar no Cliente E no Servidor**
```typescript
// ❌ ERRADO: Confiar apenas no cliente
<Button onClick={() => updateStatus('BILLED')}>Faturar</Button>

// ✅ CORRETO: Validar antes de mostrar
{canEdit && availableStatuses.includes('BILLED') && (
  <Button onClick={() => updateStatus('BILLED')}>Faturar</Button>
)}
```

### **2. Mostrar Mensagens Específicas**
```typescript
// ❌ ERRADO: Mensagem genérica
toast.error('Erro ao atualizar')

// ✅ CORRETO: Usar mensagem do backend
toast.error(error.message || 'Erro ao atualizar')
```

### **3. Atualizar Cache Corretamente**
```typescript
// Sempre invalidar após mudança
queryClient.invalidateQueries(['demands'])
queryClient.invalidateQueries(['demand', demandId])
queryClient.invalidateQueries(['demand-history', demandId])
```

---

## 📚 **Documentação de Referência**

- **Backend Guide:** Ver guia fornecido pelo backend (246 testes passando)
- **LGPD:** ANALYST só acessa suas próprias demands
- **Roles:** Administrador, Recursos Humanos, Atendente, Profissional de Saúde, Faturista

---

## ✅ **Status Final**

✅ **Utilitários criados**  
✅ **Hooks implementados**  
✅ **Componentes prontos para uso**  
✅ **APIs integradas**  
✅ **Tratamento de erros**  

**Próximo passo:** Aplicar nos componentes existentes conforme checklist 🚀

---

**Última atualização:** 26 de outubro de 2025  
**Versão:** 2.0.0 - Sistema de Permissões e Auditoria
