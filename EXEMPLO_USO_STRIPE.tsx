// ============================================================================
// EXEMPLO DE USO - INTEGRAÇÃO STRIPE CHECKOUT
// ============================================================================

'use client'

import { usePlans, useCreateCheckoutAndRedirect } from '@/hooks/use-billing'
import { PricingGrid } from '@/components/pricing-card'
import { Button } from '@/components/ui/button'

// ----------------------------------------------------------------------------
// Exemplo 1: Página simples de planos com checkout
// ----------------------------------------------------------------------------
export function SimplePlansPage() {
  const { data: plans, isLoading } = usePlans()
  const { createAndRedirect, isLoading: isCreatingCheckout } = useCreateCheckoutAndRedirect()

  const handleSelectPlan = async (planId: string, cycle: 'monthly' | 'yearly') => {
    const plan = plans?.find(p => p.id === planId)
    const priceId = cycle === 'monthly' 
      ? plan?.stripe_price_monthly_id 
      : plan?.stripe_price_yearly_id

    if (!priceId) return

    await createAndRedirect({
      priceId,
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/plans`,
    })
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Escolha seu Plano</h1>
      <PricingGrid 
        plans={plans || []} 
        onSelectPlan={handleSelectPlan}
        disabled={isCreatingCheckout}
      />
    </div>
  )
}

// ----------------------------------------------------------------------------
// Exemplo 2: Botão de upgrade inline
// ----------------------------------------------------------------------------
export function UpgradeButton({ planId }: { planId: string }) {
  const { createAndRedirect, isLoading } = useCreateCheckoutAndRedirect()

  const handleUpgrade = async () => {
    await createAndRedirect({
      priceId: planId,
      successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/subscription`,
      metadata: {
        upgrade: 'true',
      },
    })
  }

  return (
    <Button onClick={handleUpgrade} disabled={isLoading}>
      {isLoading ? 'Redirecionando...' : 'Fazer Upgrade'}
    </Button>
  )
}

// ----------------------------------------------------------------------------
// Exemplo 3: Verificar limites e oferecer upgrade
// ----------------------------------------------------------------------------
import { useCanCreateResource } from '@/hooks/use-billing'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function CreateMemberButton({ organizationId }: { organizationId: string }) {
  const { data: canCreate } = useCanCreateResource(organizationId, 'member')
  const { createAndRedirect } = useCreateCheckoutAndRedirect()

  if (!canCreate?.allowed) {
    return (
      <Alert>
        <AlertDescription>
          {canCreate?.reason}
          <Button 
            className="ml-4" 
            size="sm"
            onClick={() => createAndRedirect({
              priceId: 'price_professional', // ID do plano superior
              successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: `${window.location.origin}/subscription`,
            })}
          >
            Fazer Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <Button onClick={() => console.log('Criar membro')}>Adicionar Membro</Button>
}
