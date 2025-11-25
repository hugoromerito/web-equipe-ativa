import { api } from './api-client'

export interface CreateStripeCheckoutRequest {
  priceId: string
  successUrl: string
  cancelUrl: string
  quantity?: number
  metadata?: Record<string, string>
}

export interface CreateStripeCheckoutResponse {
  sessionId: string
  url: string
}

/**
 * Cria uma sessão de checkout do Stripe
 * Usa a rota de subscriptions do backend que retorna uma URL de checkout
 */
export async function createStripeCheckout(
  data: CreateStripeCheckoutRequest
): Promise<CreateStripeCheckoutResponse> {
  try {
    console.log('🔄 Creating Stripe Checkout session...', data)
    
    // O backend espera organization_id, plan_id e billing_cycle
    // Como estamos recebendo priceId, vamos enviar diretamente para o Stripe
    const response = await api
      .post('subscriptions/create-checkout-session', { 
        json: {
          price_id: data.priceId,
          success_url: data.successUrl,
          cancel_url: data.cancelUrl,
          quantity: data.quantity,
          metadata: data.metadata,
        }
      })
      .json<CreateStripeCheckoutResponse>()
    
    console.log('✅ Checkout session created:', response)
    return response
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    throw error
  }
}

/**
 * Recupera informações de uma sessão de checkout
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const response = await api
      .get(`checkout/session/${sessionId}`)
      .json<{
        session: {
          id: string
          payment_status: string
          customer_email?: string
          amount_total: number
          currency: string
        }
      }>()
    
    return response
  } catch (error) {
    console.error('❌ Error fetching checkout session:', error)
    throw error
  }
}
