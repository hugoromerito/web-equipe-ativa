# Sistema de Pagamentos e Assinaturas - Frontend

Este documento descreve como usar o sistema de pagamentos e assinaturas no frontend da aplicação Equipe Ativa.

## 🚀 Início Rápido

### 1. Configuração

Adicione a chave pública do Stripe ao arquivo `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 2. Instalação

As dependências já foram instaladas:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 📦 Componentes Criados

### 1. **StripeProvider** (`src/components/stripe-provider.tsx`)

Provider que inicializa o Stripe Elements.

```tsx
import { StripeProvider } from '@/components/stripe-provider'

<StripeProvider clientSecret={clientSecret}>
  {children}
</StripeProvider>
```

### 2. **PricingCard** e **PricingGrid** (`src/components/pricing-card.tsx`)

Exibem planos disponíveis com preços e recursos.

```tsx
import { PricingGrid } from '@/components/pricing-card'

<PricingGrid
  plans={plans}
  currentPlanId={subscription?.plan_id}
  onSelectPlan={(planId, billingCycle) => {
    // Handle plan selection
  }}
/>
```

### 3. **CheckoutForm** (`src/components/checkout-form.tsx`)

Formulário de pagamento com Stripe Elements.

```tsx
import { CheckoutForm } from '@/components/checkout-form'
import { StripeProvider } from '@/components/stripe-provider'

<StripeProvider clientSecret={clientSecret}>
  <CheckoutForm
    onSuccess={() => console.log('Payment successful')}
    onError={(error) => console.error(error)}
    returnUrl="/subscription/success"
  />
</StripeProvider>
```

### 4. **PaymentMethodsList** (`src/components/payment-methods-list.tsx`)

Lista e gerencia métodos de pagamento salvos.

```tsx
import { PaymentMethodsList } from '@/components/payment-methods-list'

<PaymentMethodsList
  paymentMethods={paymentMethods}
  onSetDefault={(id) => updatePaymentMethod(id)}
  onDelete={(id) => deletePaymentMethod(id)}
  onAddNew={() => setShowAddDialog(true)}
/>
```

### 5. **ResourceLimitAlert** (`src/components/resource-limit-alert.tsx`)

Alerta quando um limite de recurso é atingido.

```tsx
import { ResourceLimitAlert, ResourceLimitGuard } from '@/components/resource-limit-alert'

// Como alerta
<ResourceLimitAlert
  organizationId={orgId}
  resourceType="member"
  onUpgrade={() => router.push('/subscription')}
/>

// Como guard
<ResourceLimitGuard
  organizationId={orgId}
  resourceType="demand"
  fallback={<div>Limite atingido</div>}
>
  <CreateDemandButton />
</ResourceLimitGuard>
```

### 6. **SubscriptionSummary** (`src/components/subscription-summary.tsx`)

Resume informações da assinatura atual.

```tsx
import { SubscriptionSummary } from '@/components/subscription-summary'

<SubscriptionSummary subscription={subscription} />
```

## 🎣 Hooks Personalizados

Todos os hooks estão em `src/hooks/use-billing.ts`:

### Planos

```tsx
import { usePlans, usePlan } from '@/hooks/use-billing'

const { data: plans, isLoading } = usePlans()
const { data: plan } = usePlan(planId)
```

### Assinaturas

```tsx
import { 
  useOrganizationSubscription, 
  useCreateSubscription,
  useCancelSubscription,
  useSubscriptionUsage
} from '@/hooks/use-billing'

// Obter assinatura
const { data: subscription } = useOrganizationSubscription(orgId)

// Criar assinatura
const createMutation = useCreateSubscription()
await createMutation.mutateAsync({
  organization_id: orgId,
  plan_id: planId,
  billing_cycle: 'monthly'
})

// Cancelar assinatura
const cancelMutation = useCancelSubscription()
await cancelMutation.mutateAsync({
  subscriptionId: subscription.id,
  data: { cancel_immediately: false }
})

// Verificar uso
const { data: usage } = useSubscriptionUsage(subscription.id)
```

### Métodos de Pagamento

```tsx
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod
} from '@/hooks/use-billing'

const { data: methods } = usePaymentMethods(orgId)

// Adicionar método
const createMethod = useCreatePaymentMethod()
await createMethod.mutateAsync({
  organization_id: orgId,
  stripe_payment_method_id: 'pm_xxx',
  set_as_default: true
})

// Atualizar método
const updateMethod = useUpdatePaymentMethod()
await updateMethod.mutateAsync({
  paymentMethodId: 'id',
  data: { is_default: true }
})

// Deletar método
const deleteMethod = useDeletePaymentMethod()
await deleteMethod.mutateAsync(methodId)
```

### Limites de Recursos

```tsx
import { useCanCreateResource } from '@/hooks/use-billing'

const { data } = useCanCreateResource(orgId, 'member')

if (!data?.allowed) {
  console.log('Cannot create:', data?.reason)
}
```

## 📄 Páginas Criadas

### 1. Página Principal de Assinatura
**URL:** `/subscription`

Página completa com tabs para:
- Visão geral da assinatura
- Uso de recursos
- Métodos de pagamento
- Histórico de pagamentos
- Alteração de planos

### 2. Página de Sucesso
**URL:** `/subscription/success`

Exibida após pagamento bem-sucedido.

### 3. Página de Erro
**URL:** `/subscription/error`

Exibida quando ocorre erro no pagamento.

## 🔧 Exemplos de Uso

### Criar Nova Assinatura

```tsx
'use client'

import { useState } from 'react'
import { usePlans, useCreateSubscription } from '@/hooks/use-billing'
import { PricingGrid } from '@/components/pricing-card'
import { CheckoutForm } from '@/components/checkout-form'
import { StripeProvider } from '@/components/stripe-provider'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function SubscriptionFlow({ organizationId }: { organizationId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  
  const { data: plans } = usePlans()
  const createSubscription = useCreateSubscription()

  const handleSelectPlan = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    const result = await createSubscription.mutateAsync({
      organization_id: organizationId,
      plan_id: planId,
      billing_cycle: billingCycle,
    })

    if (result.requires_payment && result.client_secret) {
      setClientSecret(result.client_secret)
      setShowCheckout(true)
    }
  }

  return (
    <>
      <PricingGrid
        plans={plans || []}
        onSelectPlan={handleSelectPlan}
      />

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                onSuccess={() => setShowCheckout(false)}
              />
            </StripeProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### Verificar Limite Antes de Criar Recurso

```tsx
'use client'

import { useState } from 'react'
import { useCanCreateResource } from '@/hooks/use-billing'
import { Button } from '@/components/ui/button'
import { ResourceLimitAlert } from '@/components/resource-limit-alert'

export function CreateMemberButton({ organizationId }: { organizationId: string }) {
  const { data: canCreate } = useCanCreateResource(organizationId, 'member')
  const [showDialog, setShowDialog] = useState(false)

  const handleCreate = () => {
    if (canCreate?.allowed) {
      setShowDialog(true)
      // Proceed with creation
    }
  }

  return (
    <>
      {!canCreate?.allowed && (
        <ResourceLimitAlert
          organizationId={organizationId}
          resourceType="member"
        />
      )}
      
      <Button 
        onClick={handleCreate}
        disabled={!canCreate?.allowed}
      >
        Adicionar Membro
      </Button>
    </>
  )
}
```

### Exibir Status da Assinatura

```tsx
'use client'

import { useOrganizationSubscription } from '@/hooks/use-billing'
import { SubscriptionSummary } from '@/components/subscription-summary'
import { Skeleton } from '@/components/ui/skeleton'

export function SubscriptionStatus({ organizationId }: { organizationId: string }) {
  const { data: subscription, isLoading } = useOrganizationSubscription(organizationId)

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (!subscription) {
    return (
      <div>
        <p>Nenhuma assinatura ativa</p>
        <Button onClick={() => router.push('/subscription')}>
          Assinar Agora
        </Button>
      </div>
    )
  }

  return <SubscriptionSummary subscription={subscription} />
}
```

### Gerenciar Cartões de Crédito

```tsx
'use client'

import { useState } from 'react'
import { usePaymentMethods, useUpdatePaymentMethod, useDeletePaymentMethod } from '@/hooks/use-billing'
import { PaymentMethodsList } from '@/components/payment-methods-list'
import { SetupPaymentForm } from '@/components/checkout-form'
import { StripeProvider } from '@/components/stripe-provider'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function PaymentMethodsManager({ organizationId }: { organizationId: string }) {
  const [showAddCard, setShowAddCard] = useState(false)
  
  const { data: methods } = usePaymentMethods(organizationId)
  const updateMethod = useUpdatePaymentMethod()
  const deleteMethod = useDeletePaymentMethod()

  return (
    <>
      <PaymentMethodsList
        paymentMethods={methods || []}
        onSetDefault={(id) => updateMethod.mutateAsync({
          paymentMethodId: id,
          data: { is_default: true }
        })}
        onDelete={(id) => deleteMethod.mutateAsync(id)}
        onAddNew={() => setShowAddCard(true)}
      />

      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <StripeProvider>
            <SetupPaymentForm
              onSuccess={(paymentMethodId) => {
                console.log('Card added:', paymentMethodId)
                setShowAddCard(false)
              }}
            />
          </StripeProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

## 🎨 Personalização

### Tema do Stripe Elements

Personalize a aparência em `src/components/stripe-provider.tsx`:

```tsx
appearance: {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0070f3',
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorDanger: '#ef4444',
    fontFamily: 'system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
}
```

## 🔒 Segurança

- ✅ Nunca exponha `STRIPE_SECRET_KEY` no frontend
- ✅ Use apenas `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ Validação de pagamentos feita no backend
- ✅ Webhooks validam eventos do Stripe
- ✅ Client Secrets são únicos por transação

## 📚 Recursos Adicionais

- [Documentação Stripe React](https://stripe.com/docs/stripe-js/react)
- [Stripe Elements](https://stripe.com/docs/payments/elements)
- [Testing Cards](https://stripe.com/docs/testing#cards)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

## 🧪 Testando

### Cartões de Teste

Use estes cartões no modo de teste:

| Número | Cenário |
|--------|---------|
| `4242 4242 4242 4242` | Pagamento bem-sucedido |
| `4000 0000 0000 9995` | Pagamento recusado |
| `4000 0025 0000 3155` | Requer autenticação 3D Secure |

**Expiry:** Qualquer data futura  
**CVC:** Qualquer 3 dígitos  
**ZIP:** Qualquer 5 dígitos

## 🐛 Troubleshooting

### Erro: "Stripe has not been initialized"

Certifique-se de que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` está configurado.

### Erro: "No client secret provided"

O backend precisa retornar `client_secret` ao criar assinatura.

### Pagamento não aparece

Verifique se os webhooks estão configurados corretamente no Stripe Dashboard.

## 📝 Próximos Passos

- [ ] Implementar upgrade/downgrade de planos
- [ ] Adicionar cupons de desconto
- [ ] Implementar múltiplas moedas
- [ ] Criar relatórios de faturamento
- [ ] Adicionar notificações por email
