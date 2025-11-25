import { api } from './api-client'

// Re-export Stripe Checkout functions
export { createStripeCheckout, getCheckoutSession } from './create-stripe-checkout'
export type { CreateStripeCheckoutRequest, CreateStripeCheckoutResponse } from './create-stripe-checkout'

// Types
export interface Plan {
  id: string
  name: string
  description: string | null
  price_monthly: number
  price_yearly: number
  currency: string
  max_members: number | null
  max_units: number | null
  max_demands: number | null
  max_storage_gb: number | null
  features: string[]
  is_popular: boolean
  trial_days: number
  stripe_product_id: string | null
  stripe_price_monthly_id: string | null
  stripe_price_yearly_id: string | null
  created_at: string
  updated_at: string
}

// Stripe Product Types (resposta real da API)
export interface StripePrice {
  id: string
  unit_amount: number
  currency: string
  recurring?: {
    interval: 'month' | 'year'
    interval_count: number
  }
}

export interface StripeProduct {
  id: string
  name: string
  description: string | null
  active: boolean
  default_price: StripePrice | string
  metadata: {
    max_members?: string
    max_units?: string
    max_demands?: string
    max_storage_gb?: string
    features?: string
    is_popular?: string
    trial_days?: string
  }
}

export interface Subscription {
  id: string
  organization_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at: string | null
  trial_end: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
  plan?: Plan
}

export interface PaymentMethod {
  id: string
  organization_id: string
  type: 'card'
  card_brand: string | null
  card_last4: string | null
  card_exp_month: number | null
  card_exp_year: number | null
  is_default: boolean
  stripe_payment_method_id: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  subscription_id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  payment_method_id: string | null
  stripe_payment_intent_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface UsageRecord {
  resource_type: 'member' | 'unit' | 'demand' | 'storage'
  current_usage: number
  limit: number | null
  percentage_used: number | null
}

export interface CanCreateResourceResponse {
  allowed: boolean
  reason: string | null
  current_usage?: number
  limit?: number | null
}

// Plans
export async function getPlans() {
  try {
    const response = await api.get('plans').json<{ plans?: Plan[], products?: StripeProduct[] }>()
    
    // O backend pode retornar 'plans' ou 'products' (Stripe)
    if (response.plans && Array.isArray(response.plans)) {
      return { plans: response.plans }
    }
    
    if (response.products && Array.isArray(response.products)) {
      // Converter produtos Stripe para o formato Plan
      const plans: Plan[] = response.products.map(product => {
        const defaultPrice = typeof product.default_price === 'object' 
          ? product.default_price 
          : { unit_amount: 0, currency: 'brl' }
        
        // Parse features string
        let features: string[] = []
        if (product.metadata?.features) {
          try {
            features = product.metadata.features
              .replace(/'/g, '')
              .split(',')
              .map((f: string) => f.trim())
              .filter((f: string) => f.length > 0)
          } catch (e) {
            // Silently ignore parsing errors
          }
        }
        
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price_monthly: defaultPrice.unit_amount / 100, // Converter de centavos para reais
          price_yearly: (defaultPrice.unit_amount * 10) / 100, // 10 meses (2 grátis no anual)
          currency: defaultPrice.currency,
          max_members: product.metadata?.max_members ? parseInt(product.metadata.max_members) : null,
          max_units: product.metadata?.max_units ? parseInt(product.metadata.max_units) : null,
          max_demands: product.metadata?.max_demands ? parseInt(product.metadata.max_demands) : null,
          max_storage_gb: product.metadata?.max_storage_gb ? parseInt(product.metadata.max_storage_gb) : null,
          features,
          is_popular: product.metadata?.is_popular === 'true',
          trial_days: product.metadata?.trial_days ? parseInt(product.metadata.trial_days) : 0,
          stripe_product_id: product.id,
          stripe_price_monthly_id: typeof product.default_price === 'string' ? product.default_price : product.default_price.id,
          stripe_price_yearly_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      })
      
      return { plans }
    }
    
    throw new Error('Formato de resposta inválido da API')
  } catch (error) {
    throw error
  }
}

export async function getPlan(planId: string) {
  const result = await api.get(`plans/${planId}`).json<{ plan: Plan }>()
  return result
}

// Subscriptions
export interface CreateSubscriptionRequest {
  organization_id: string
  plan_id: string
  payment_method_id?: string
  trial_days?: number
  billing_cycle?: 'monthly' | 'yearly'
}

export interface CreateSubscriptionResponse {
  subscription: Subscription
  client_secret?: string
  requires_payment: boolean
  url?: string // URL do Stripe Checkout (se o backend retornar)
}

export async function createSubscription(data: CreateSubscriptionRequest) {
  try {
    const result = await api
      .post('subscriptions', { json: data })
      .json<CreateSubscriptionResponse>()
    
    return result
  } catch (error: any) {
    // Tentar obter detalhes do erro do backend
    if (error.response) {
      try {
        const errorText = await error.response.text()
        
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || errorData.error || 'Erro ao criar assinatura')
        } catch (parseError) {
          throw new Error(`Backend error: ${errorText}`)
        }
      } catch (textError) {
        // Ignore text read errors
      }
    }
    
    throw error
  }
}

export async function getOrganizationSubscription(organizationId: string) {
  try {
    const result = await api
      .get(`organizations/${organizationId}/subscription`)
      .json<{ subscription: Subscription | null }>()
    return result
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching subscription:', {
        organizationId,
        status: error.response?.status,
        message: error.message,
      })
    }
    throw error
  }
}

export interface CancelSubscriptionRequest {
  cancel_immediately?: boolean
}

export async function cancelSubscription(
  subscriptionId: string,
  data?: CancelSubscriptionRequest
) {
  const result = await api
    .post(`subscriptions/${subscriptionId}/cancel`, { json: data || {} })
    .json<{ subscription: Subscription }>()
  return result
}

export async function getSubscriptionUsage(subscriptionId: string) {
  const result = await api
    .get(`subscriptions/${subscriptionId}/usage`)
    .json<{ usage: UsageRecord[] }>()
  return result
}

// Payment Methods
export async function getPaymentMethods(organizationId: string) {
  try {
    const result = await api
      .get(`organizations/${organizationId}/payment-methods`)
      .json<{ payment_methods: PaymentMethod[] }>()
    return result
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching payment methods:', {
        organizationId,
        status: error.response?.status,
        message: error.message,
      })
    }
    throw error
  }
}

export interface CreatePaymentMethodRequest {
  organization_id: string
  stripe_payment_method_id: string
  set_as_default?: boolean
}

export async function createPaymentMethod(data: CreatePaymentMethodRequest) {
  const result = await api
    .post('payment-methods', { json: data })
    .json<{ payment_method: PaymentMethod }>()
  return result
}

export interface UpdatePaymentMethodRequest {
  is_default?: boolean
}

export async function updatePaymentMethod(
  paymentMethodId: string,
  data: UpdatePaymentMethodRequest
) {
  const result = await api
    .patch(`payment-methods/${paymentMethodId}`, { json: data })
    .json<{ payment_method: PaymentMethod }>()
  return result
}

export async function deletePaymentMethod(paymentMethodId: string) {
  await api.delete(`payment-methods/${paymentMethodId}`)
}

// Payments
export async function getSubscriptionPayments(subscriptionId: string) {
  const result = await api
    .get(`subscriptions/${subscriptionId}/payments`)
    .json<{ payments: Payment[] }>()
  return result
}

// Resource Limits
export async function canCreateResource(
  organizationId: string,
  resourceType: 'member' | 'unit' | 'demand'
) {
  const result = await api
    .get(`organizations/${organizationId}/can-create/${resourceType}`)
    .json<CanCreateResourceResponse>()
  return result
}
