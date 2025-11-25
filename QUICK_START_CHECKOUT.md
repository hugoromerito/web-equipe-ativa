# Quick Start - Checkout de Planos

## 1️⃣ Configuração (5 minutos)

### Adicionar variável de ambiente:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.equipeativa.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 2️⃣ Usar em qualquer página

```tsx
import { usePlans, useCreateCheckoutAndRedirect } from '@/hooks/use-billing'
import { PricingGrid } from '@/components/pricing-card'

export default function MyPage() {
  const { data: plans } = usePlans()
  const { createAndRedirect } = useCreateCheckoutAndRedirect()

  const handleSelectPlan = async (planId: string, cycle: 'monthly' | 'yearly') => {
    const plan = plans?.find(p => p.id === planId)
    const priceId = cycle === 'monthly' ? plan?.stripe_price_monthly_id : plan?.stripe_price_yearly_id

    await createAndRedirect({
      priceId: priceId!,
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/cancel`,
    })
  }

  return <PricingGrid plans={plans || []} onSelectPlan={handleSelectPlan} />
}
```

## 3️⃣ Pronto! ✅

O usuário será redirecionado para o Stripe Checkout e, após o pagamento, voltará para a URL de sucesso.

## Páginas já implementadas:

- `/plans` - Página pública de planos
- `/subscription` - Gerenciamento completo de assinatura
- `/subscription/success` - Confirmação de pagamento
- `/subscription/cancel` - Cancelamento

## Cartões de teste:

- Sucesso: `4242 4242 4242 4242`
- Recusado: `4000 0000 0000 0002`
- CVV: qualquer 3 dígitos
- Data: qualquer data futura
