# Implementação Completa - Stripe Frontend

Este documento detalha a implementação completa da integração com Stripe no frontend do sistema Equipe Ativa.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Fluxos de Pagamento](#fluxos-de-pagamento)
- [Componentes](#componentes)
- [Páginas](#páginas)
- [Hooks e API](#hooks-e-api)
- [Configuração](#configuração)
- [Exemplos de Uso](#exemplos-de-uso)
- [Testes](#testes)

## 🎯 Visão Geral

O sistema implementa dois fluxos principais de pagamento com Stripe:

1. **Stripe Checkout (Hosted)** - Página de checkout completa hospedada pelo Stripe
2. **Stripe Elements (Embedded)** - Formulário de pagamento integrado na aplicação

### Quando usar cada um?

- **Stripe Checkout**: Melhor para fluxos simples, sem necessidade de customização visual
- **Stripe Elements**: Melhor para experiência completamente integrada e customizada

## 📁 Estrutura de Arquivos

```
src/
├── app/(app)/
│   ├── subscription/
│   │   ├── page.tsx              # Página principal de assinatura
│   │   ├── success/page.tsx      # Página de sucesso
│   │   └── cancel/page.tsx       # Página de cancelamento
│   └── plans/page.tsx            # Página standalone de planos
│
├── components/
│   ├── pricing-card.tsx          # Componente de card de plano
│   ├── checkout-form.tsx         # Formulário de checkout (Stripe Elements)
│   ├── stripe-provider.tsx       # Provider do Stripe Elements
│   └── payment-methods-list.tsx  # Lista de métodos de pagamento
│
├── hooks/
│   └── use-billing.ts            # Hooks React Query para billing
│
└── http/
    ├── billing.ts                # API calls relacionadas a billing
    └── create-stripe-checkout.ts # API call para Stripe Checkout
```

## 🔄 Fluxos de Pagamento

### Fluxo 1: Stripe Checkout (Recomendado para simplicidade)

```
Usuário → Seleciona Plano → POST /checkout → Redireciona para Stripe
          ↓
Stripe → Processa Pagamento → Redireciona de volta
          ↓
/success ou /cancel
```

**Vantagens:**
- ✅ Implementação mais simples
- ✅ Stripe cuida da UI/UX
- ✅ Menos código para manter
- ✅ Suporte automático a métodos de pagamento locais
- ✅ Mobile-friendly por padrão

**Desvantagens:**
- ❌ Menos controle sobre a experiência visual
- ❌ Usuário sai temporariamente da aplicação

### Fluxo 2: Stripe Elements (Para experiência integrada)

```
Usuário → Seleciona Plano → POST /subscriptions → Recebe client_secret
          ↓
Modal com Stripe Elements → Confirma pagamento no lugar
          ↓
Assinatura ativada
```

**Vantagens:**
- ✅ Experiência completamente integrada
- ✅ Usuário permanece na aplicação
- ✅ Controle total sobre UI/UX
- ✅ Pode capturar dados adicionais facilmente

**Desvantagens:**
- ❌ Implementação mais complexa
- ❌ Mais código para manter
- ❌ Requer mais testes

## 🧩 Componentes

### PricingCard

Exibe informações de um plano e permite seleção de ciclo de cobrança.

```tsx
import { PricingGrid } from '@/components/pricing-card'

<PricingGrid
  plans={plans}
  currentPlanId={subscription?.plan_id}
  onSelectPlan={(planId, cycle) => handleSelectPlan(planId, cycle)}
  disabled={isProcessing}
/>
```

**Props:**
- `plans: Plan[]` - Array de planos disponíveis
- `currentPlanId?: string` - ID do plano atual (para destacar)
- `onSelectPlan: (planId, cycle) => void` - Callback quando usuário seleciona
- `disabled?: boolean` - Desabilita interação

### CheckoutForm

Formulário de pagamento usando Stripe Elements.

```tsx
import { CheckoutForm } from '@/components/checkout-form'
import { StripeProvider } from '@/components/stripe-provider'

<StripeProvider clientSecret={clientSecret}>
  <CheckoutForm
    onSuccess={() => handleSuccess()}
    onError={(error) => handleError(error)}
    returnUrl="/subscription/success"
  />
</StripeProvider>
```

**Props:**
- `onSuccess?: () => void` - Callback de sucesso
- `onError?: (error: string) => void` - Callback de erro
- `returnUrl?: string` - URL para retornar após pagamento

### PaymentMethodsList

Lista métodos de pagamento salvos com opções de gerenciamento.

```tsx
import { PaymentMethodsList } from '@/components/payment-methods-list'

<PaymentMethodsList
  paymentMethods={paymentMethods}
  onSetDefault={(id) => handleSetDefault(id)}
  onDelete={(id) => handleDelete(id)}
  onAddNew={() => handleAddNew()}
  isLoading={isLoading}
/>
```

## 📄 Páginas

### /plans - Página Pública de Planos

Página standalone para exibir planos e permitir compra via Stripe Checkout.

**Características:**
- ✅ Não requer autenticação
- ✅ Usa Stripe Checkout (hosted)
- ✅ Inclui FAQ
- ✅ Responsiva

**Uso:**
```
https://seuapp.com/plans
```

### /subscription - Gerenciamento de Assinatura

Página completa de gerenciamento para usuários autenticados.

**Características:**
- ✅ Requer autenticação
- ✅ Visualizar assinatura atual
- ✅ Gerenciar métodos de pagamento
- ✅ Ver histórico de pagamentos
- ✅ Monitorar uso de recursos
- ✅ Alterar ou cancelar plano

**Abas:**
1. **Visão Geral** - Status da assinatura
2. **Uso** - Consumo de recursos (membros, unidades, etc)
3. **Métodos de Pagamento** - Cartões salvos
4. **Histórico** - Transações passadas
5. **Planos** - Trocar de plano

### /subscription/success - Confirmação de Pagamento

Página exibida após pagamento bem-sucedido.

**Query Params:**
- `session_id` - ID da sessão do Stripe (para Stripe Checkout)
- `payment_intent` - ID do Payment Intent (para Stripe Elements)

### /subscription/cancel - Cancelamento

Página exibida quando usuário cancela o pagamento.

## 🔌 Hooks e API

### Hooks React Query

Todos os hooks estão em `src/hooks/use-billing.ts`:

```tsx
// Planos
const { data: plans } = usePlans()
const { data: plan } = usePlan(planId)

// Assinaturas
const { data: subscription } = useOrganizationSubscription(orgId)
const createSubscription = useCreateSubscription()
const cancelSubscription = useCancelSubscription()
const { data: usage } = useSubscriptionUsage(subscriptionId)

// Métodos de Pagamento
const { data: paymentMethods } = usePaymentMethods(orgId)
const createPaymentMethod = useCreatePaymentMethod()
const updatePaymentMethod = useUpdatePaymentMethod()
const deletePaymentMethod = useDeletePaymentMethod()

// Pagamentos
const { data: payments } = useSubscriptionPayments(subscriptionId)

// Limites
const { data: canCreate } = useCanCreateResource(orgId, 'member')
```

### API Calls

Todas as chamadas de API estão em `src/http/`:

**billing.ts:**
```tsx
import { getPlans, createSubscription } from '@/http/billing'

// Listar planos
const { plans } = await getPlans()

// Criar assinatura
const result = await createSubscription({
  organization_id: 'org_xxx',
  plan_id: 'plan_xxx',
  billing_cycle: 'monthly',
})
```

**create-stripe-checkout.ts:**
```tsx
import { createStripeCheckout } from '@/http/create-stripe-checkout'

// Criar checkout do Stripe
const { url } = await createStripeCheckout({
  priceId: 'price_xxx',
  successUrl: 'https://app.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl: 'https://app.com/cancel',
})

window.location.href = url
```

## ⚙️ Configuração

### Variáveis de Ambiente

Adicione no `.env.local`:

```bash
# API Backend
NEXT_PUBLIC_API_URL=https://api.equipeativa.com

# Stripe (obtenha em dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Verificação de Configuração

O sistema verifica automaticamente se o Stripe está configurado:

```tsx
const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

{!isStripeConfigured && (
  <Alert>
    Stripe não configurado. Configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  </Alert>
)}
```

## 💡 Exemplos de Uso

### Exemplo 1: Implementar página de checkout simples

```tsx
'use client'

import { usePlans } from '@/hooks/use-billing'
import { createStripeCheckout } from '@/http/create-stripe-checkout'
import { PricingGrid } from '@/components/pricing-card'

export default function SimplePlansPage() {
  const { data: plans } = usePlans()

  const handleSelectPlan = async (planId: string, cycle: 'monthly' | 'yearly') => {
    const plan = plans?.find(p => p.id === planId)
    const priceId = cycle === 'monthly' 
      ? plan?.stripe_price_monthly_id 
      : plan?.stripe_price_yearly_id

    const { url } = await createStripeCheckout({
      priceId: priceId!,
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/plans`,
    })

    window.location.href = url
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Escolha seu Plano</h1>
      <PricingGrid plans={plans || []} onSelectPlan={handleSelectPlan} />
    </div>
  )
}
```

### Exemplo 2: Verificar se usuário pode criar recursos

```tsx
import { useCanCreateResource } from '@/hooks/use-billing'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

function CreateMemberButton({ organizationId }: { organizationId: string }) {
  const { data: canCreate } = useCanCreateResource(organizationId, 'member')

  if (!canCreate?.allowed) {
    return (
      <Alert>
        Limite atingido: {canCreate?.reason}
        <Button onClick={() => router.push('/subscription')}>
          Fazer Upgrade
        </Button>
      </Alert>
    )
  }

  return <Button onClick={createMember}>Adicionar Membro</Button>
}
```

### Exemplo 3: Exibir uso de recursos

```tsx
import { useSubscriptionUsage } from '@/hooks/use-billing'
import { Progress } from '@/components/ui/progress'

function UsageDisplay({ subscriptionId }: { subscriptionId: string }) {
  const { data: usage } = useSubscriptionUsage(subscriptionId)

  return (
    <div className="space-y-4">
      {usage?.map((record) => (
        <div key={record.resource_type}>
          <div className="flex justify-between mb-2">
            <span>{record.resource_type}</span>
            <span>{record.current_usage} / {record.limit || '∞'}</span>
          </div>
          {record.limit && (
            <Progress value={record.percentage_used || 0} />
          )}
        </div>
      ))}
    </div>
  )
}
```

### Exemplo 4: Modal de upgrade

```tsx
import { Dialog } from '@/components/ui/dialog'
import { PricingGrid } from '@/components/pricing-card'
import { usePlans, useCreateSubscription } from '@/hooks/use-billing'

function UpgradeModal({ open, onClose, organizationId }) {
  const { data: plans } = usePlans()
  const createSubscription = useCreateSubscription()

  const handleUpgrade = async (planId: string, cycle: 'monthly' | 'yearly') => {
    await createSubscription.mutateAsync({
      organization_id: organizationId,
      plan_id: planId,
      billing_cycle: cycle,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Fazer Upgrade</DialogTitle>
        </DialogHeader>
        <PricingGrid
          plans={plans || []}
          onSelectPlan={handleUpgrade}
          disabled={createSubscription.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
```

## 🧪 Testes

### Cartões de Teste do Stripe

Use em ambiente de desenvolvimento/teste:

| Cartão | Número | Comportamento |
|--------|--------|---------------|
| Sucesso | `4242 4242 4242 4242` | Pagamento aprovado |
| Requer autenticação | `4000 0027 6000 3184` | Solicita 3D Secure |
| Recusado | `4000 0000 0000 0002` | Pagamento recusado |
| Insuficiente | `4000 0000 0000 9995` | Fundos insuficientes |

**Data de validade:** Qualquer data futura (ex: 12/34)  
**CVV:** Qualquer 3 dígitos (ex: 123)  
**CEP:** Qualquer 5 dígitos (ex: 12345)

### Testar Webhooks Localmente

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Encaminhar webhooks para localhost
stripe listen --forward-to localhost:3333/webhooks/stripe

# Em outro terminal, disparar evento de teste
stripe trigger payment_intent.succeeded
```

### Checklist de Testes

- [ ] Criar assinatura com plano mensal
- [ ] Criar assinatura com plano anual
- [ ] Cancelar assinatura (fim do período)
- [ ] Cancelar assinatura (imediato)
- [ ] Reativar assinatura cancelada
- [ ] Adicionar método de pagamento
- [ ] Definir método de pagamento padrão
- [ ] Remover método de pagamento
- [ ] Fazer upgrade de plano
- [ ] Fazer downgrade de plano
- [ ] Verificar limites de recursos
- [ ] Visualizar histórico de pagamentos
- [ ] Fluxo completo: Planos → Checkout → Success
- [ ] Fluxo de cancelamento: Planos → Checkout → Cancel
- [ ] Pagamento com autenticação 3D Secure
- [ ] Pagamento recusado

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Nunca expor chaves secretas** - Apenas `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` no frontend  
✅ **Validação no backend** - Todas as ações críticas validadas no servidor  
✅ **Webhooks assinados** - Backend valida assinatura dos webhooks  
✅ **HTTPS obrigatório** - Em produção, sempre usar HTTPS  
✅ **Client Secrets únicos** - Cada sessão de pagamento tem seu próprio secret  
✅ **Timeout de sessões** - Payment Intents expiram após 24h  

### Não fazer

❌ Nunca validar pagamento apenas no frontend  
❌ Nunca confiar apenas no callback de sucesso  
❌ Nunca armazenar dados de cartão  
❌ Nunca enviar dados sensíveis em query params  
❌ Nunca usar chaves de produção em desenvolvimento  

## 📚 Referências

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Elements Documentation](https://stripe.com/docs/stripe-js)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## 🆘 Troubleshooting

### Problema: "Stripe não configurado"

**Solução:** Adicione `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` no `.env.local`

### Problema: Checkout não abre

**Possíveis causas:**
- Token JWT expirado ou inválido
- `priceId` não existe no Stripe
- CORS bloqueando requisição

**Debug:**
```tsx
console.log('Token:', localStorage.getItem('authToken'))
console.log('Price ID:', priceId)
```

### Problema: Webhook não está sendo recebido

**Possíveis causas:**
- URL do webhook incorreta no Stripe Dashboard
- Assinatura do webhook não validada
- Firewall bloqueando requisição

**Solução:**
1. Verificar URL em Stripe Dashboard → Developers → Webhooks
2. Testar localmente com Stripe CLI
3. Verificar logs no Stripe Dashboard

### Problema: Assinatura não aparece após pagamento

**Possíveis causas:**
- Webhook ainda não processado (pode levar alguns segundos)
- Erro no processamento do webhook
- Cache não invalidado

**Solução:**
1. Aguardar alguns segundos
2. Verificar logs do webhook no Stripe Dashboard
3. Recarregar a página (hard refresh)

## 📝 Notas Adicionais

### Performance

- Planos são cacheados por React Query
- Assinaturas são revalidadas após mutações
- Stripe Elements carrega de forma assíncrona

### Acessibilidade

- Todos os componentes são acessíveis por teclado
- Labels apropriadas em formulários
- Mensagens de erro claras
- Loading states visíveis

### Internacionalização

- Preços formatados para BRL
- Datas formatadas para pt-BR
- Mensagens em português

### Mobile

- Layouts responsivos
- Touch-friendly buttons
- Modal adapta ao tamanho da tela
- Stripe Checkout é mobile-optimized

---

**Documentação criada em:** 24 de novembro de 2025  
**Versão:** 1.0.0  
**Autor:** Equipe Ativa Dev Team
