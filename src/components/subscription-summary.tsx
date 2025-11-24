'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type Subscription } from '@/http/billing'
import { Calendar, CreditCard, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SubscriptionSummaryProps {
  subscription: Subscription
}

export function SubscriptionSummary({ subscription }: SubscriptionSummaryProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      active: { variant: 'default', label: 'Ativa' },
      trialing: { variant: 'secondary', label: 'Período de Teste' },
      past_due: { variant: 'destructive', label: 'Pagamento Atrasado' },
      canceled: { variant: 'outline', label: 'Cancelada' },
      incomplete: { variant: 'outline', label: 'Incompleta' },
    }

    const { variant, label } = variants[status] || { variant: 'outline', label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{subscription.plan?.name || 'Plano'}</CardTitle>
            <CardDescription>Detalhes da sua assinatura</CardDescription>
          </div>
          {getStatusBadge(subscription.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Valor</p>
              <p className="text-sm text-muted-foreground">
                {subscription.plan?.currency === 'brl' ? 'R$' : '$'}{' '}
                {subscription.plan?.price_monthly.toFixed(2)}/mês
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Período de cobrança</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(subscription.current_period_start), 'dd/MM/yyyy', { locale: ptBR })}
                {' - '}
                {format(new Date(subscription.current_period_end), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Próxima cobrança</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(subscription.current_period_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
          <>
            <Separator />
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Período de Teste</p>
              <p className="text-sm text-muted-foreground">
                Ativo até {format(new Date(subscription.trial_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </>
        )}

        {subscription.cancel_at_period_end && (
          <>
            <Separator />
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">Cancelamento Agendado</p>
              <p className="text-sm text-muted-foreground">
                Sua assinatura será cancelada em{' '}
                {format(new Date(subscription.current_period_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
