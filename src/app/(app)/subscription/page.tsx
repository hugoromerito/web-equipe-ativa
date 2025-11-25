'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PricingGrid } from '@/components/pricing-card'
import { CheckoutForm } from '@/components/checkout-form'
import { PaymentMethodsList } from '@/components/payment-methods-list'
import { StripeProvider } from '@/components/stripe-provider'
import {
  usePlans,
  useOrganizationSubscription,
  useCreateSubscription,
  useCancelSubscription,
  useSubscriptionUsage,
  usePaymentMethods,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  useSubscriptionPayments,
} from '@/hooks/use-billing'
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Users, 
  Building2, 
  FileText,
  HardDrive,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function SubscriptionPage() {
  const router = useRouter()
  
  // Buscar organizações do usuário para obter a atual
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoadingOrg, setIsLoadingOrg] = useState(true)

  useEffect(() => {
    // Tentar obter da URL, localStorage ou buscar organizações
    const getOrganizationId = async () => {
      try {
        // 1. Tentar localStorage
        const storedOrg = localStorage.getItem('currentOrganization')
        if (storedOrg) {
          console.log('✅ Organization ID from localStorage:', storedOrg)
          setOrganizationId(storedOrg)
          setIsLoadingOrg(false)
          return
        }

        // 2. Buscar organizações do usuário
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        if (!token) {
          console.error('❌ No auth token found')
          router.push('/auth/sign-in')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch organizations')
        }

        const data = await response.json()
        
        if (data.organizations && data.organizations.length > 0) {
          const firstOrg = data.organizations[0].id
          console.log('✅ Using first organization:', firstOrg)
          setOrganizationId(firstOrg)
          localStorage.setItem('currentOrganization', firstOrg)
        } else {
          console.error('❌ No organizations found')
          // Redirecionar para criar organização
          router.push('/create-organization')
        }
      } catch (error) {
        console.error('❌ Error getting organization:', error)
      } finally {
        setIsLoadingOrg(false)
      }
    }

    getOrganizationId()
  }, [router])

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Verificar se Stripe está configurado
  const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  // Queries
  const { data: plans, isLoading: plansLoading, error: plansError } = usePlans()
  const { data: subscription, isLoading: subscriptionLoading } = useOrganizationSubscription(organizationId)
  const { data: usage, isLoading: usageLoading } = useSubscriptionUsage(subscription?.id || '')
  const { data: paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods(organizationId)
  const { data: payments, isLoading: paymentsLoading } = useSubscriptionPayments(subscription?.id || '')

  // Mutations
  const createSubscriptionMutation = useCreateSubscription()
  const cancelSubscriptionMutation = useCancelSubscription()
  const updatePaymentMethodMutation = useUpdatePaymentMethod()
  const deletePaymentMethodMutation = useDeletePaymentMethod()

  const handleSelectPlan = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    setSelectedPlanId(planId)
    setSelectedBillingCycle(billingCycle)

    // Buscar o plano selecionado
    const selectedPlan = plans?.find(p => p.id === planId)
    
    if (!selectedPlan) {
      console.error('Plano não encontrado')
      return
    }

    // Verificar se organizationId existe
    if (!organizationId) {
      console.error('Organization ID não encontrado')
      alert('Erro: Organization ID não encontrado. Recarregue a página.')
      return
    }

    console.log('🔄 Criando assinatura:', {
      organizationId,
      planId,
      billingCycle,
      plan: selectedPlan
    })

    // Usar a API de subscription que já existe
    try {
      const result = await createSubscriptionMutation.mutateAsync({
        organization_id: organizationId,
        plan_id: planId,
        billing_cycle: billingCycle,
      })

      console.log('✅ Resultado da criação:', result)

      // Se retornar uma URL, redirecionar para o Stripe Checkout
      if (result.url) {
        console.log('🔗 Redirecionando para:', result.url)
        window.location.href = result.url
      } 
      // Se retornar client_secret, usar o modal com Stripe Elements
      else if (result.requires_payment && result.client_secret) {
        console.log('💳 Abrindo modal de pagamento')
        setClientSecret(result.client_secret)
        setShowCheckoutDialog(true)
      } 
      // Se não precisar de pagamento, apenas recarregar
      else {
        console.log('✅ Assinatura criada sem necessidade de pagamento')
        router.refresh()
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar assinatura:', error)
      
      // Exibir mensagem de erro mais amigável
      const errorMessage = error.response?.message || error.message || 'Erro desconhecido ao criar assinatura'
      alert(`Erro: ${errorMessage}\n\nVerifique o console para mais detalhes.`)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    try {
      await cancelSubscriptionMutation.mutateAsync({
        subscriptionId: subscription.id,
        data: { cancel_immediately: false },
      })
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
    }
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await updatePaymentMethodMutation.mutateAsync({
        paymentMethodId,
        data: { is_default: true },
      })
    } catch (error) {
      console.error('Erro ao definir método padrão:', error)
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethodMutation.mutateAsync(paymentMethodId)
    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      active: { variant: 'default', label: 'Ativa' },
      trialing: { variant: 'secondary', label: 'Trial' },
      past_due: { variant: 'destructive', label: 'Atrasada' },
      canceled: { variant: 'outline', label: 'Cancelada' },
      incomplete: { variant: 'outline', label: 'Incompleta' },
    }

    const { variant, label } = variants[status] || { variant: 'outline', label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, icon: React.ReactNode }> = {
      succeeded: { variant: 'default', label: 'Pago', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { variant: 'secondary', label: 'Pendente', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      failed: { variant: 'destructive', label: 'Falhou', icon: <AlertCircle className="h-3 w-3" /> },
      refunded: { variant: 'outline', label: 'Reembolsado', icon: <AlertCircle className="h-3 w-3" /> },
    }

    const { variant, label, icon } = variants[status] || { variant: 'outline', label: status, icon: null }
    return (
      <Badge variant={variant} className="gap-1">
        {icon}
        {label}
      </Badge>
    )
  }

  if (plansLoading || subscriptionLoading || isLoadingOrg) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Organização não encontrada. Por favor, crie uma organização primeiro.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Assinatura e Pagamentos</h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura, métodos de pagamento e histórico de cobranças
        </p>
      </div>

      {plansError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Não foi possível carregar os planos.</strong>
            <br />
            {plansError instanceof Error ? plansError.message : 'Verifique sua conexão e tente novamente.'}
            <br />
            <span className="text-xs opacity-75">
              {plansError instanceof Error && plansError.stack ? plansError.stack.split('\n')[0] : ''}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {!isStripeConfigured && process.env.NODE_ENV === 'development' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Stripe não configurado:</strong> Configure a chave pública do Stripe no arquivo{' '}
            <code className="rounded bg-muted px-1 text-xs">.env.local</code> para processar pagamentos.
          </AlertDescription>
        </Alert>
      )}

      {subscription ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="usage">Uso</TabsTrigger>
            <TabsTrigger value="payment-methods">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Assinatura Atual</CardTitle>
                    <CardDescription>
                      {subscription.plan?.name || 'Carregando...'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Próxima cobrança</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(subscription.current_period_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Valor</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {subscription.plan?.price_monthly.toFixed(2)}/mês
                      </p>
                    </div>
                  </div>
                </div>

                {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Período de teste ativo até{' '}
                      {format(new Date(subscription.trial_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </AlertDescription>
                  </Alert>
                )}

                {subscription.cancel_at_period_end && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sua assinatura será cancelada em{' '}
                      {format(new Date(subscription.current_period_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                <div className="flex gap-2">
                  {!subscription.cancel_at_period_end ? (
                    <Button
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={cancelSubscriptionMutation.isPending}
                    >
                      {cancelSubscriptionMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelando...
                        </>
                      ) : (
                        'Cancelar Assinatura'
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline">
                      Reativar Assinatura
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            {usageLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {usage?.map((record) => {
                  const percentage = record.percentage_used || 0
                  const icons = {
                    member: Users,
                    unit: Building2,
                    demand: FileText,
                    storage: HardDrive,
                  }
                  const Icon = icons[record.resource_type]

                  return (
                    <Card key={record.resource_type}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-base capitalize">
                            {record.resource_type === 'member' && 'Membros'}
                            {record.resource_type === 'unit' && 'Unidades'}
                            {record.resource_type === 'demand' && 'Demandas'}
                            {record.resource_type === 'storage' && 'Armazenamento'}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uso atual</span>
                          <span className="font-medium">
                            {record.current_usage}
                            {record.limit !== null && ` / ${record.limit}`}
                            {record.resource_type === 'storage' && ' GB'}
                          </span>
                        </div>
                        {record.limit !== null && (
                          <Progress value={percentage} className="h-2" />
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>
                  Gerencie seus cartões de crédito e débito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodsList
                  paymentMethods={paymentMethods || []}
                  onSetDefault={handleSetDefaultPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                  isLoading={paymentMethodsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Veja todas as suas transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {payment.currency === 'brl' ? 'R$' : '$'}{' '}
                              {(payment.amount / 100).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.paid_at
                                ? format(new Date(payment.paid_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                : 'Pendente'}
                            </p>
                          </div>
                        </div>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum pagamento registrado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Alterar Plano</h2>
              <p className="text-muted-foreground">
                Escolha um plano que melhor atenda suas necessidades
              </p>
            </div>
            <PricingGrid
              plans={plans || []}
              currentPlanId={subscription.plan_id}
              onSelectPlan={handleSelectPlan}
              disabled={createSubscriptionMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui uma assinatura ativa. Escolha um plano para começar.
            </AlertDescription>
          </Alert>

          <div>
            <h2 className="mb-2 text-2xl font-bold">Escolha seu Plano</h2>
            <p className="text-muted-foreground">
              Selecione o plano ideal para sua organização
            </p>
          </div>

          <PricingGrid
            plans={plans || []}
            onSelectPlan={handleSelectPlan}
            disabled={createSubscriptionMutation.isPending}
          />
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Finalizar Assinatura</DialogTitle>
            <DialogDescription>
              Complete o pagamento para ativar sua assinatura
            </DialogDescription>
          </DialogHeader>
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                onSuccess={() => {
                  setShowCheckoutDialog(false)
                  router.refresh()
                }}
                onError={(error) => {
                  console.error('Erro no checkout:', error)
                }}
              />
            </StripeProvider>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
