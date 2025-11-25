'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useStripeProducts,
  useStripeSubscriptions,
  useCreateStripeCheckout,
  useCustomerPortal,
  useCancelSubscription,
} from '@/hooks/use-stripe-simple'
import { UsageDashboard } from '@/components/usage-dashboard'
import { getProfile } from '@/http/get-profile'
import { useQuery } from '@tanstack/react-query'
import { Loader2, ExternalLink } from 'lucide-react'
import { useOrganization } from '@/hooks/use-organization'

export default function SubscriptionPage() {
  const params = useParams<{ org: string }>()
  const organizationSlug = params?.org
  const [activeTab, setActiveTab] = useState('plans')

  // Buscar organização para obter o ID
  const { data: orgData } = useOrganization(organizationSlug!)
  const organizationId = orgData?.organization?.id

  // Buscar perfil do usuário para obter o email
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  })

  const userEmail = profileData?.user?.email

  // Queries simplificadas
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useStripeProducts()
  
  const { 
    data: subscriptionsData, 
    isLoading: subscriptionsLoading,
    error: subscriptionsError
  } = useStripeSubscriptions(userEmail)
  
  // Mutations
  const createCheckout = useCreateStripeCheckout()
  const openPortal = useCustomerPortal()
  const cancelSubscription = useCancelSubscription()

  const subscriptions = subscriptionsData?.subscriptions || []

  // Log de erro de subscriptions (não deve quebrar a página)
  if (subscriptionsError) {
    console.warn('⚠️ Erro ao buscar assinaturas (não crítico):', subscriptionsError)
  }

  const handleCancelSubscription = (subscriptionId: string, immediately = false) => {
    if (!confirm(immediately ? 'Cancelar assinatura imediatamente?' : 'Cancelar assinatura ao fim do período?')) {
      return
    }
    
    cancelSubscription.mutate({ subscriptionId, immediately })
  }

  const handleSelectPlan = (priceId: string) => {
    if (!userEmail) {
      alert('Email do usuário não encontrado. Faça login novamente.')
      return
    }

    if (!organizationSlug) {
      alert('Organização não identificada.')
      return
    }

    const baseUrl = window.location.origin
    const successUrl = `${baseUrl}/org/${organizationSlug}/subscription/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/org/${organizationSlug}/subscription`

    createCheckout.mutate({
      priceId,
      customerEmail: userEmail,
      successUrl,
      cancelUrl,
      metadata: {
        organizationId: organizationSlug,
      },
    })
  }

  const handleOpenPortal = () => {
    if (!userEmail) {
      alert('Email do usuário não encontrado. Faça login novamente.')
      return
    }

    openPortal.mutate({
      customerEmail: userEmail,
      returnUrl: window.location.href,
    })
  }

  // Helper para processar features do metadata
  const parseFeatures = (featuresString?: string): string[] => {
    if (!featuresString) return []
    // Remove aspas simples e divide por vírgula
    return featuresString
      .split(',')
      .map(f => f.trim().replace(/'/g, ''))
      .filter(f => f.length > 0)
  }

  // Helper para obter o preço do produto
  const getPrice = (product: any) => {
    if (typeof product.default_price === 'object' && product.default_price !== null) {
      return product.default_price
    }
    return null
  }

  // Loading state
  if (productsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-500">
            <CardContent className="py-12 text-center">
              <p className="text-red-600 dark:text-red-400">
                Erro ao carregar planos. Tente novamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Current subscription section
  const currentSub = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Planos e Assinatura
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Escolha o melhor plano para sua organização
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Planos Disponíveis</TabsTrigger>
            <TabsTrigger value="current">Assinatura Atual</TabsTrigger>
            <TabsTrigger value="usage">Uso do Plano</TabsTrigger>
          </TabsList>

          {/* Tab: Planos Disponíveis */}
          <TabsContent value="plans" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {products && products.length > 0 ? (
                products.map((product) => {
                  const price = getPrice(product)
                  const features = parseFeatures(product.metadata?.features)
                  
                  if (!price) {
                    return null
                  }

                  return (
                    <Card key={product.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        {product.description && (
                          <CardDescription>{product.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        {/* Preço */}
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">
                            {(price.unit_amount / 100).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: price.currency.toUpperCase(),
                            })}
                          </div>
                          <p className="text-sm text-gray-500">
                            por {price.recurring?.interval === 'month' ? 'mês' : 'ano'}
                          </p>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                          <ul className="space-y-2 text-sm">
                            {features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Metadata */}
                        {product.metadata && (
                          <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
                            {product.metadata.max_members && (
                              <p>👥 Até {product.metadata.max_members} membros</p>
                            )}
                            {product.metadata.max_units && (
                              <p>🏢 Até {product.metadata.max_units} unidades</p>
                            )}
                            {product.metadata.max_demands && (
                              <p>📋 Até {product.metadata.max_demands} demandas/mês</p>
                            )}
                            {product.metadata.max_storage_gb && (
                              <p>💾 {product.metadata.max_storage_gb} GB de armazenamento</p>
                            )}
                          </div>
                        )}

                        {/* Botão */}
                        <Button
                          onClick={() => handleSelectPlan(price.id)}
                          disabled={createCheckout.isPending}
                          className="w-full mt-4"
                        >
                          {createCheckout.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            'Selecionar Plano'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum plano disponível no momento.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Assinatura Atual */}
          <TabsContent value="current" className="space-y-6 mt-6">
            {currentSub ? (
              <Card className="border-2 border-blue-500 dark:border-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Assinatura Atual</span>
                    <Badge variant={currentSub.status === 'active' ? 'default' : 'secondary'}>
                      {currentSub.status === 'active' ? 'Ativa' : currentSub.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Plano</p>
                      <p className="font-semibold">
                        {currentSub.items?.data[0]?.price?.product?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Próxima cobrança</p>
                      <p className="font-semibold">
                        {currentSub.current_period_end 
                          ? new Date(currentSub.current_period_end * 1000).toLocaleDateString('pt-BR')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  {currentSub.cancel_at_period_end && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Sua assinatura será cancelada em{' '}
                        {new Date(currentSub.current_period_end * 1000).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleOpenPortal}
                      disabled={openPortal.isPending}
                      className="flex-1"
                      variant="outline"
                    >
                      {openPortal.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Abrindo...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Gerenciar Assinatura
                        </>
                      )}
                    </Button>

                    {!currentSub.cancel_at_period_end && (
                      <Button
                        onClick={() => handleCancelSubscription(currentSub.id)}
                        disabled={cancelSubscription.isPending}
                        variant="destructive"
                      >
                        {cancelSubscription.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelando...
                          </>
                        ) : (
                          'Cancelar'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <p className="text-gray-500">
                    Você ainda não possui uma assinatura ativa.
                  </p>
                  <Button onClick={() => setActiveTab('plans')}>
                    Ver Planos Disponíveis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Uso do Plano */}
          <TabsContent value="usage" className="mt-6">
            {organizationId ? (
              <UsageDashboard 
                organizationId={organizationId} 
                organizationSlug={organizationSlug}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">
                    Carregando informações da organização...
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
