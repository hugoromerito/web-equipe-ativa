'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPlans,
  getPlan,
  getOrganizationSubscription,
  createSubscription,
  cancelSubscription,
  getSubscriptionUsage,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getSubscriptionPayments,
  canCreateResource,
  type CreateSubscriptionRequest,
  type CreatePaymentMethodRequest,
  type UpdatePaymentMethodRequest,
  type CancelSubscriptionRequest,
} from '@/http/billing'
import { useToast } from '@/hooks/use-toast'

// Plans
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { plans } = await getPlans()
      return plans
    },
  })
}

export function usePlan(planId: string) {
  return useQuery({
    queryKey: ['plans', planId],
    queryFn: async () => {
      const { plan } = await getPlan(planId)
      return plan
    },
    enabled: !!planId,
  })
}

// Subscriptions
export function useOrganizationSubscription(organizationId: string) {
  return useQuery({
    queryKey: ['subscriptions', organizationId],
    queryFn: async () => {
      const { subscription } = await getOrganizationSubscription(organizationId)
      return subscription
    },
    enabled: !!organizationId,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => createSubscription(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['subscriptions', variables.organization_id],
      })
      toast({
        title: 'Assinatura criada',
        description: 'Sua assinatura foi criada com sucesso.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar assinatura',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      subscriptionId,
      data,
    }: {
      subscriptionId: string
      data?: CancelSubscriptionRequest
    }) => cancelSubscription(subscriptionId, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['subscriptions', result.subscription.organization_id],
      })
      toast({
        title: 'Assinatura cancelada',
        description: 'Sua assinatura foi cancelada com sucesso.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao cancelar assinatura',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useSubscriptionUsage(subscriptionId: string) {
  return useQuery({
    queryKey: ['subscriptions', subscriptionId, 'usage'],
    queryFn: async () => {
      const { usage } = await getSubscriptionUsage(subscriptionId)
      return usage
    },
    enabled: !!subscriptionId,
  })
}

// Payment Methods
export function usePaymentMethods(organizationId: string) {
  return useQuery({
    queryKey: ['payment-methods', organizationId],
    queryFn: async () => {
      const { payment_methods } = await getPaymentMethods(organizationId)
      return payment_methods
    },
    enabled: !!organizationId,
  })
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreatePaymentMethodRequest) =>
      createPaymentMethod(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['payment-methods', variables.organization_id],
      })
      toast({
        title: 'Método de pagamento adicionado',
        description: 'Seu cartão foi adicionado com sucesso.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao adicionar método de pagamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      paymentMethodId,
      data,
    }: {
      paymentMethodId: string
      data: UpdatePaymentMethodRequest
    }) => updatePaymentMethod(paymentMethodId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['payment-methods'],
      })
      toast({
        title: 'Método de pagamento atualizado',
        description: 'Suas alterações foram salvas.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar método de pagamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      deletePaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['payment-methods'],
      })
      toast({
        title: 'Método de pagamento removido',
        description: 'O cartão foi removido com sucesso.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao remover método de pagamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// Payments
export function useSubscriptionPayments(subscriptionId: string) {
  return useQuery({
    queryKey: ['subscriptions', subscriptionId, 'payments'],
    queryFn: async () => {
      const { payments } = await getSubscriptionPayments(subscriptionId)
      return payments
    },
    enabled: !!subscriptionId,
  })
}

// Resource Limits
export function useCanCreateResource(
  organizationId: string,
  resourceType: 'member' | 'unit' | 'demand'
) {
  return useQuery({
    queryKey: ['can-create', organizationId, resourceType],
    queryFn: () => canCreateResource(organizationId, resourceType),
    enabled: !!organizationId && !!resourceType,
  })
}
