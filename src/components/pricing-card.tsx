'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type Plan } from '@/http/billing'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface PricingCardProps {
  plan: Plan
  isCurrentPlan?: boolean
  onSelect: (planId: string, billingCycle: 'monthly' | 'yearly') => void
  disabled?: boolean
}

export function PricingCard({
  plan,
  isCurrentPlan = false,
  onSelect,
  disabled = false,
}: PricingCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  )

  const price =
    billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
  const pricePerMonth =
    billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly

  const savings =
    billingCycle === 'yearly'
      ? Math.round(
          ((plan.price_monthly * 12 - plan.price_yearly) /
            (plan.price_monthly * 12)) *
            100
        )
      : 0

  return (
    <Card
      className={`relative flex flex-col ${
        plan.is_popular
          ? 'border-primary shadow-lg scale-105'
          : 'border-border'
      }`}
    >
      {plan.is_popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Mais Popular
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        {plan.description && (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Anual
            {savings > 0 && (
              <span className="ml-1 text-xs text-green-600">
                -{savings}%
              </span>
            )}
          </button>
        </div>

        {/* Price */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {plan.currency === 'brl' ? 'R$' : '$'}
            </span>
            <span className="text-4xl font-bold">
              {pricePerMonth.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          {billingCycle === 'yearly' && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.currency === 'brl' ? 'R$' : '$'} {price.toFixed(2)}{' '}
              cobrado anualmente
            </p>
          )}
          {plan.trial_days > 0 && (
            <Badge variant="secondary" className="mt-2">
              {plan.trial_days} dias grátis
            </Badge>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="space-y-2">
            {plan.max_members !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>
                  {plan.max_members === 0
                    ? 'Membros ilimitados'
                    : `Até ${plan.max_members} membros`}
                </span>
              </div>
            )}
            {plan.max_units !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>
                  {plan.max_units === 0
                    ? 'Unidades ilimitadas'
                    : `Até ${plan.max_units} unidades`}
                </span>
              </div>
            )}
            {plan.max_demands !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>
                  {plan.max_demands === 0
                    ? 'Demandas ilimitadas'
                    : `Até ${plan.max_demands} demandas/mês`}
                </span>
              </div>
            )}
            {plan.max_storage_gb !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>{plan.max_storage_gb} GB de armazenamento</span>
              </div>
            )}
          </div>

          {plan.features && plan.features.length > 0 && (
            <div className="space-y-2 border-t pt-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.is_popular ? 'default' : 'outline'}
          onClick={() => onSelect(plan.id, billingCycle)}
          disabled={disabled || isCurrentPlan}
        >
          {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PricingGridProps {
  plans: Plan[]
  currentPlanId?: string
  onSelectPlan: (planId: string, billingCycle: 'monthly' | 'yearly') => void
  disabled?: boolean
}

export function PricingGrid({
  plans,
  currentPlanId,
  onSelectPlan,
  disabled = false,
}: PricingGridProps) {
  // Ordena os planos por preço
  const sortedPlans = [...plans].sort(
    (a, b) => a.price_monthly - b.price_monthly
  )

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {sortedPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={plan.id === currentPlanId}
          onSelect={onSelectPlan}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
