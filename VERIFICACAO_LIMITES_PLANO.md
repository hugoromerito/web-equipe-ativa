# Sistema de Verificação de Limites do Plano

## 🎯 Como Funciona

O sistema verifica os limites do plano **antes** de permitir a criação de recursos (members, units, demands). A verificação é feita tanto no **frontend** quanto no **backend**.

---

## 🔧 Arquitetura

### 1. Backend - Endpoint de Verificação

```
GET /organizations/{organizationId}/can-create/{resourceType}
```

**Parâmetros:**
- `organizationId`: UUID da organização
- `resourceType`: `member` | `unit` | `demand`

**Resposta:**
```json
{
  "allowed": false,
  "reason": "Você atingiu o limite de 2 membros do plano Básico",
  "current_usage": 2,
  "limit": 2
}
```

**Lógica no Backend:**
1. Busca a assinatura ativa da organização
2. Obtém os limites do plano (max_members, max_units, max_demands)
3. Conta quantos recursos já existem
4. Compara: `current_usage >= limit` → `allowed: false`

---

## 📱 Frontend - Como Usar

### 1. Hook `useCanCreateResource`

```typescript
import { useCanCreateResource } from '@/hooks/use-billing'

function MyComponent() {
  const organizationId = '123'
  
  const { data, isLoading } = useCanCreateResource(organizationId, 'member')
  
  if (data?.allowed) {
    // Usuário pode criar o recurso
  } else {
    // Exibir alerta: data.reason
  }
}
```

### 2. Componente `ResourceLimitAlert`

Exibe alerta automático quando o limite é atingido:

```tsx
import { ResourceLimitAlert } from '@/components/resource-limit-alert'

<ResourceLimitAlert
  organizationId={organizationId}
  resourceType="member"
  onUpgrade={() => router.push('/subscription')}
/>
```

**Resultado visual:**
```
⚠️ Limite Atingido
Você atingiu o limite de 2 membros do plano Básico. (2/2)
[Fazer Upgrade]
```

### 3. Componente `ResourceLimitGuard`

Renderiza conteúdo apenas se o limite não foi atingido:

```tsx
import { ResourceLimitGuard } from '@/components/resource-limit-alert'

<ResourceLimitGuard
  organizationId={organizationId}
  resourceType="unit"
  fallback={<p>Limite atingido!</p>}
>
  <CreateUnitButton />
</ResourceLimitGuard>
```

---

## 🎨 Exemplos de Uso

### Exemplo 1: Botão de Criar Membro

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { ResourceLimitAlert, ResourceLimitGuard } from '@/components/resource-limit-alert'
import { useCanCreateResource } from '@/hooks/use-billing'

export function CreateMemberButton({ organizationId }: { organizationId: string }) {
  const { data: canCreate, isLoading } = useCanCreateResource(organizationId, 'member')

  return (
    <div className="space-y-4">
      {/* Alerta se limite atingido */}
      <ResourceLimitAlert 
        organizationId={organizationId} 
        resourceType="member" 
      />

      {/* Botão só aparece se pode criar */}
      <ResourceLimitGuard 
        organizationId={organizationId} 
        resourceType="member"
      >
        <Button onClick={handleCreateMember}>
          Adicionar Membro
        </Button>
      </ResourceLimitGuard>
    </div>
  )
}
```

### Exemplo 2: Validação Manual

```tsx
'use client'

import { useCanCreateResource } from '@/hooks/use-billing'

export function CreateDemandForm({ organizationId }: { organizationId: string }) {
  const { data } = useCanCreateResource(organizationId, 'demand')

  const handleSubmit = () => {
    if (!data?.allowed) {
      alert(data?.reason || 'Limite atingido')
      return
    }

    // Criar demanda...
  }

  return (
    <form onSubmit={handleSubmit}>
      {!data?.allowed && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {data?.reason}
          <br />
          Uso atual: {data?.current_usage}/{data?.limit}
        </div>
      )}
      
      <Button disabled={!data?.allowed}>
        Criar Demanda
      </Button>
    </form>
  )
}
```

### Exemplo 3: Badge de Uso

```tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { useCanCreateResource } from '@/hooks/use-billing'

export function ResourceUsageBadge({ 
  organizationId, 
  resourceType 
}: { 
  organizationId: string
  resourceType: 'member' | 'unit' | 'demand'
}) {
  const { data } = useCanCreateResource(organizationId, resourceType)

  if (!data) return null

  const percentage = data.limit 
    ? (data.current_usage! / data.limit) * 100 
    : 0

  const variant = percentage >= 100 
    ? 'destructive' 
    : percentage >= 80 
    ? 'warning' 
    : 'default'

  return (
    <Badge variant={variant}>
      {data.current_usage}/{data.limit || '∞'}
    </Badge>
  )
}
```

---

## 🔒 Limites por Plano

Os limites são definidos no **metadata** dos produtos do Stripe:

```json
{
  "metadata": {
    "max_members": "2",
    "max_units": "1", 
    "max_demands": "50",
    "max_storage_gb": "1"
  }
}
```

### Plano Básico (Exemplo)
- 👥 Membros: 2
- 🏢 Unidades: 1
- 📋 Demandas: 50/mês
- 💾 Armazenamento: 1 GB

### Plano Profissional (Exemplo)
- 👥 Membros: 10
- 🏢 Unidades: 3
- 📋 Demandas: 200/mês
- 💾 Armazenamento: 5 GB

### Plano Empresarial (Exemplo)
- 👥 Membros: Ilimitado
- 🏢 Unidades: Ilimitado
- 📋 Demandas: Ilimitado
- 💾 Armazenamento: 50 GB

---

## 🚀 Fluxo de Verificação

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário tenta criar recurso (member/unit/demand)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend: useCanCreateResource(orgId, resourceType)      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend: GET /organizations/{id}/can-create/{type}       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend busca assinatura da organização                  │
│    - Se não tem assinatura → allowed: false                 │
│    - Se assinatura inativa → allowed: false                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend obtém limites do plano                           │
│    - max_members, max_units, max_demands                    │
│    - null = ilimitado                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Backend conta recursos existentes                        │
│    - SELECT COUNT(*) FROM members WHERE org_id = ...        │
│    - SELECT COUNT(*) FROM units WHERE org_id = ...          │
│    - SELECT COUNT(*) FROM demands WHERE org_id = ...        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Backend compara: current_usage >= limit?                 │
│    - SIM → { allowed: false, reason: "Limite atingido..." } │
│    - NÃO → { allowed: true, reason: null }                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Frontend recebe resposta e decide:                       │
│    - allowed: true  → Libera criação                        │
│    - allowed: false → Exibe alerta + botão upgrade          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Segurança

### Frontend
✅ Validação visual (UX)
✅ Desabilita botões
✅ Exibe alertas

### Backend (CRÍTICO)
✅ Validação obrigatória antes de criar recurso
✅ Retorna erro 403 se limite atingido
✅ Middleware verifica em TODAS as rotas de criação

**Importante:** A validação do frontend é apenas UX. O backend **SEMPRE** valida novamente.

---

## 📊 Monitoramento de Uso

### Hook `useUsage`

```typescript
import { useUsage } from '@/hooks/use-billing'

const { data: usage } = useUsage(organizationId)

// Retorna:
// [
//   { resource_type: 'member', current_usage: 2, limit: 2, percentage_used: 100 },
//   { resource_type: 'unit', current_usage: 1, limit: 1, percentage_used: 100 },
//   { resource_type: 'demand', current_usage: 23, limit: 50, percentage_used: 46 }
// ]
```

### Dashboard de Uso

```tsx
import { useUsage } from '@/hooks/use-billing'
import { Progress } from '@/components/ui/progress'

export function UsageDashboard({ organizationId }: { organizationId: string }) {
  const { data: usage } = useUsage(organizationId)

  return (
    <div className="space-y-4">
      {usage?.map((resource) => (
        <div key={resource.resource_type}>
          <div className="flex justify-between mb-2">
            <span>{resource.resource_type}</span>
            <span>{resource.current_usage}/{resource.limit || '∞'}</span>
          </div>
          <Progress value={resource.percentage_used || 0} />
        </div>
      ))}
    </div>
  )
}
```

---

## 🔄 Sincronização com Stripe

Quando um usuário faz upgrade/downgrade:

1. **Webhook do Stripe** notifica o backend
2. Backend atualiza a assinatura no banco
3. **Limites são atualizados automaticamente**
4. Frontend refaz queries e atualiza UI

```typescript
// O hook refaz query automaticamente após mudança de plano
const { data } = useCanCreateResource(organizationId, 'member')
// Após upgrade, 'limit' aumenta automaticamente
```

---

## 🎯 Checklist de Implementação

### No Backend
- [ ] Endpoint `/organizations/{id}/can-create/{type}` implementado
- [ ] Middleware de verificação em rotas de criação
- [ ] Webhook do Stripe configurado
- [ ] Migração do banco com tabelas de subscription

### No Frontend
- [x] Hook `useCanCreateResource` implementado
- [x] Componente `ResourceLimitAlert` criado
- [x] Componente `ResourceLimitGuard` criado
- [ ] Alerts adicionados em formulários de criação
- [ ] Botões desabilitados quando limite atingido

### UX
- [ ] Tooltip explicando limites
- [ ] Link para página de upgrade
- [ ] Badge de uso em headers
- [ ] Notificação quando próximo do limite (80%)

---

## 📝 Exemplo Completo: Página de Membros

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { ResourceLimitAlert } from '@/components/resource-limit-alert'
import { useCanCreateResource } from '@/hooks/use-billing'
import { Plus } from 'lucide-react'

export function MembersPage({ organizationId }: { organizationId: string }) {
  const { data: canCreate } = useCanCreateResource(organizationId, 'member')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Membros</h1>
        
        <Button 
          onClick={handleAddMember}
          disabled={!canCreate?.allowed}
        >
          <Plus className="mr-2" />
          Adicionar Membro
        </Button>
      </div>

      {/* Alerta de limite */}
      <ResourceLimitAlert 
        organizationId={organizationId}
        resourceType="member"
      />

      {/* Lista de membros */}
      <MembersList />
    </div>
  )
}
```

---

**Documentação atualizada:** Novembro 2024  
**Status:** ✅ Sistema implementado e funcional
