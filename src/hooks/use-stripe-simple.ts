import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStripeProducts,
  createStripeCheckout,
  getStripeSubscriptions,
  createCustomerPortal,
  cancelStripeSubscription,
  getOrganizationUsage,
  canCreateResource,
  type StripeCheckoutRequest,
  type CustomerPortalRequest,
} from '@/http/stripe-simple'

/**
 * Hook para listar produtos/planos do Stripe
 */
export function useStripeProducts() {
  return useQuery({
    queryKey: ['stripe', 'products'],
    queryFn: getStripeProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}

/**
 * Hook para listar assinaturas do cliente
 */
export function useStripeSubscriptions(customerEmail: string | undefined) {
  return useQuery({
    queryKey: ['stripe', 'subscriptions', customerEmail],
    queryFn: () => {
      if (!customerEmail) {
        return { subscriptions: [] }
      }
      return getStripeSubscriptions(customerEmail)
    },
    enabled: !!customerEmail && customerEmail.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false, // Não retentar em caso de erro 500
  })
}

/**
 * Hook para criar checkout do Stripe
 */
export function useCreateStripeCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StripeCheckoutRequest) => createStripeCheckout(data),
    onSuccess: (response) => {
      // Redireciona automaticamente para o Stripe Checkout
      window.location.href = response.url
    },
    onError: (error: Error) => {
      console.error('Erro ao criar checkout:', error)
      alert(`Erro: ${error.message}`)
    },
  })
}

/**
 * Hook para abrir Customer Portal do Stripe
 */
export function useCustomerPortal() {
  return useMutation({
    mutationFn: (data: CustomerPortalRequest) => createCustomerPortal(data),
    onSuccess: (response) => {
      // Redireciona automaticamente para o Customer Portal
      window.location.href = response.url
    },
    onError: (error: Error) => {
      console.error('Erro ao abrir portal:', error)
      alert(`Erro: ${error.message}`)
    },
  })
}

/**
 * Hook para cancelar subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subscriptionId, immediately = false }: { subscriptionId: string; immediately?: boolean }) =>
      cancelStripeSubscription(subscriptionId, immediately),
    onSuccess: () => {
      // Invalida cache de subscriptions
      queryClient.invalidateQueries({ queryKey: ['stripe', 'subscriptions'] })
    },
    onError: (error: Error) => {
      console.error('Erro ao cancelar subscription:', error)
      alert(`Erro: ${error.message}`)
    },
  })
}

/**
 * Hook para obter uso da organização
 */
export function useOrganizationUsage(organizationId: string | undefined) {
  return useQuery({
    queryKey: ['organization', 'usage', organizationId],
    queryFn: () => {
      if (!organizationId) throw new Error('Organization ID is required')
      return getOrganizationUsage(organizationId)
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 1, // 1 minuto
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: false,
  })
}

/**
 * Hook para verificar se pode criar recurso
 */
export function useCanCreateResource(
  organizationId: string | undefined,
  resourceType: 'member' | 'unit' | 'demand'
) {
  return useQuery({
    queryKey: ['organization', 'can-create', organizationId, resourceType],
    queryFn: () => {
      if (!organizationId) throw new Error('Organization ID is required')
      return canCreateResource(organizationId, resourceType)
    },
    enabled: !!organizationId,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true, // Revalida ao focar (importante para limites)
    retry: false,
  })
}
