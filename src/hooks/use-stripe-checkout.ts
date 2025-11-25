'use client'

import { useMutation } from '@tanstack/react-query'
import { createStripeCheckout, type CreateStripeCheckoutRequest } from '@/http/create-stripe-checkout'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook para criar sessões de checkout do Stripe
 * Facilita o uso do Stripe Checkout (hosted pages)
 */
export function useStripeCheckout() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateStripeCheckoutRequest) => createStripeCheckout(data),
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar checkout',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Helper para criar checkout e redirecionar automaticamente
 */
export function useCreateCheckoutAndRedirect() {
  const createCheckout = useStripeCheckout()

  const createAndRedirect = async (data: CreateStripeCheckoutRequest) => {
    try {
      const result = await createCheckout.mutateAsync(data)
      window.location.href = result.url
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      // Erro já foi exibido pelo toast do mutation
    }
  }

  return {
    createAndRedirect,
    isLoading: createCheckout.isPending,
    error: createCheckout.error,
  }
}
