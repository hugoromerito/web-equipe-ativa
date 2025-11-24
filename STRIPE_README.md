# 💳 Sistema de Pagamentos e Assinaturas - Stripe

Sistema completo de billing integrado com Stripe para gerenciar assinaturas, planos, métodos de pagamento e limites de recursos.

## 📚 Documentação

### Guias Principais
- **[STRIPE_SETUP_CHECKLIST.md](./STRIPE_SETUP_CHECKLIST.md)** - Passo a passo completo de configuração
- **[STRIPE_FRONTEND_GUIDE.md](./STRIPE_FRONTEND_GUIDE.md)** - Guia completo de uso do frontend
- **[STRIPE_IMPLEMENTATION_SUMMARY.md](./STRIPE_IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação
- **[STRIPE_INTEGRATION_EXAMPLES.md](./STRIPE_INTEGRATION_EXAMPLES.md)** - Exemplos práticos de integração

## 🚀 Início Rápido

### 1. Configuração Mínima

```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_seu_publishable_key
```

### 2. Uso Básico

```tsx
import { PricingGrid } from '@/components/pricing-card'
import { usePlans, useCreateSubscription } from '@/hooks/use-billing'

export function SubscribePage() {
  const { data: plans } = usePlans()
  const createSubscription = useCreateSubscription()

  return (
    <PricingGrid
      plans={plans || []}
      onSelectPlan={async (planId, cycle) => {
        await createSubscription.mutateAsync({
          organization_id: 'org-id',
          plan_id: planId,
          billing_cycle: cycle,
        })
      }}
    />
  )
}
```

## 📦 Estrutura de Arquivos

```
src/
├── http/
│   └── billing.ts                    # API client
├── hooks/
│   └── use-billing.ts                # React hooks
├── components/
│   ├── stripe-provider.tsx           # Stripe Elements provider
│   ├── pricing-card.tsx              # Planos e preços
│   ├── checkout-form.tsx             # Formulários de pagamento
│   ├── payment-methods-list.tsx      # Lista de cartões
│   ├── resource-limit-alert.tsx      # Alertas de limite
│   └── subscription-summary.tsx      # Resumo da assinatura
└── app/(app)/
    └── subscription/
        ├── page.tsx                  # Página principal
        ├── success/page.tsx          # Página de sucesso
        └── error/page.tsx            # Página de erro
```

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Listar e exibir planos
- [x] Criar assinaturas
- [x] Gerenciar métodos de pagamento
- [x] Processar pagamentos com Stripe Elements
- [x] Cancelar assinaturas
- [x] Verificar limites de recursos
- [x] Monitorar uso
- [x] Histórico de pagamentos
- [x] Período de trial
- [x] Suporte a planos mensais/anuais
- [x] Páginas de sucesso/erro
- [x] Alertas de limite
- [x] Guards de recursos

### 🔜 Futuras
- [ ] Upgrade/downgrade de planos
- [ ] Cupons de desconto
- [ ] Múltiplas moedas
- [ ] Relatórios de faturamento
- [ ] Invoices em PDF
- [ ] Notificações por email

## 🎨 Componentes

### PricingCard
Exibe um plano individual com preços e recursos.

```tsx
<PricingCard
  plan={plan}
  isCurrentPlan={false}
  onSelect={(id, cycle) => handleSelect(id, cycle)}
/>
```

### PricingGrid
Grade com todos os planos disponíveis.

```tsx
<PricingGrid
  plans={plans}
  currentPlanId={subscription?.plan_id}
  onSelectPlan={handleSelectPlan}
/>
```

### CheckoutForm
Formulário de pagamento com Stripe Elements.

```tsx
<StripeProvider clientSecret={secret}>
  <CheckoutForm
    onSuccess={() => router.push('/success')}
    onError={(error) => console.error(error)}
  />
</StripeProvider>
```

### PaymentMethodsList
Lista e gerencia cartões salvos.

```tsx
<PaymentMethodsList
  paymentMethods={methods}
  onSetDefault={(id) => setDefault(id)}
  onDelete={(id) => remove(id)}
  onAddNew={() => openDialog()}
/>
```

### ResourceLimitAlert
Alerta quando limite é atingido.

```tsx
<ResourceLimitAlert
  organizationId={orgId}
  resourceType="member"
/>
```

### ResourceLimitGuard
Protege ações baseado em limites.

```tsx
<ResourceLimitGuard
  organizationId={orgId}
  resourceType="demand"
>
  <CreateButton />
</ResourceLimitGuard>
```

## 🎣 Hooks

### Planos
```tsx
const { data: plans } = usePlans()
const { data: plan } = usePlan(planId)
```

### Assinaturas
```tsx
const { data: subscription } = useOrganizationSubscription(orgId)
const create = useCreateSubscription()
const cancel = useCancelSubscription()
const { data: usage } = useSubscriptionUsage(subId)
```

### Métodos de Pagamento
```tsx
const { data: methods } = usePaymentMethods(orgId)
const create = useCreatePaymentMethod()
const update = useUpdatePaymentMethod()
const remove = useDeletePaymentMethod()
```

### Limites
```tsx
const { data } = useCanCreateResource(orgId, 'member')
if (!data?.allowed) {
  // Show upgrade prompt
}
```

## 🧪 Testes

### Cartões de Teste

| Número | Resultado |
|--------|-----------|
| 4242 4242 4242 4242 | ✅ Sucesso |
| 4000 0000 0000 9995 | ❌ Recusado |
| 4000 0025 0000 3155 | 🔐 3D Secure |

**Dados adicionais:**
- Expiry: qualquer data futura
- CVC: qualquer 3 dígitos
- ZIP: qualquer 5 dígitos

### Testar Fluxo Completo

1. Acesse `/subscription`
2. Selecione um plano
3. Use cartão de teste
4. Confirme pagamento
5. Verifique redirecionamento

## 🔐 Segurança

- ✅ Apenas chave pública no frontend
- ✅ Validação de webhooks no backend
- ✅ Client secrets únicos
- ✅ HTTPS em produção
- ✅ Dados de cartão nunca armazenados

## 📱 Páginas

### `/subscription`
Página principal com tabs:
- **Visão Geral** - Status e detalhes
- **Uso** - Recursos utilizados
- **Métodos de Pagamento** - Cartões
- **Histórico** - Transações
- **Planos** - Mudar plano

### `/subscription/success`
Confirmação de pagamento bem-sucedido.

### `/subscription/error`
Erro no processamento do pagamento.

## 🛠️ Desenvolvimento

### Instalar Dependências
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install @radix-ui/react-progress
```

### Configurar Webhooks (Local)
```bash
stripe login
stripe listen --forward-to localhost:3333/webhooks/stripe
```

### Executar Desenvolvimento
```bash
npm run dev
```

## 🚀 Deploy

### 1. Configurar Variáveis
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Configurar Webhooks
No Stripe Dashboard → Webhooks → Add endpoint

URL: `https://seu-dominio.com/webhooks/stripe`

### 3. Verificar Conta
Completar verificação da conta Stripe.

## 📊 Monitoramento

- **Stripe Dashboard** - Métricas em tempo real
- **Logs Backend** - Erros e webhooks
- **Analytics** - Conversão e churn

## 🐛 Troubleshooting

### Stripe não carrega
✅ Verificar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Webhook não funciona
✅ Verificar Stripe CLI (dev) ou URL (prod)

### Pagamento não atualiza
✅ Verificar logs do webhook no backend

### Limite não verifica
✅ Verificar assinatura ativa

## 📖 Exemplos

Ver [STRIPE_INTEGRATION_EXAMPLES.md](./STRIPE_INTEGRATION_EXAMPLES.md) para exemplos completos de:
- Criar membro com verificação de limite
- Widget de assinatura no dashboard
- Verificação de storage antes de upload
- Alertas de trial ending
- E muito mais...

## 🔗 Links Úteis

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Documentação Stripe](https://stripe.com/docs)
- [Stripe React Docs](https://stripe.com/docs/stripe-js/react)
- [Testing Guide](https://stripe.com/docs/testing)

## ✅ Status

**Sistema:** ✅ Completo e pronto para uso  
**Testes:** ✅ Testado com cartões Stripe  
**Documentação:** ✅ Completa  
**Segurança:** ✅ Implementada  

---

**Desenvolvido com** ❤️ **usando Stripe + Next.js + React Query**
