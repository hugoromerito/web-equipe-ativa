import { api } from './api-client'

// ============ TYPES ============

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
  default_price: StripePrice | string // Pode ser objeto ou ID
  metadata?: {
    features?: string
    max_members?: string
    max_units?: string
    max_demands?: string
    max_storage_gb?: string
    [key: string]: string | undefined
  }
}

export interface StripeCheckoutRequest {
  priceId: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: {
    organizationId?: string
    [key: string]: string | undefined
  }
}

export interface StripeCheckoutResponse {
  sessionId: string
  url: string
}

export interface StripeSubscription {
  id: string
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing' | 'unpaid'
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  plan_name?: string
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
        }
        product: {
          name: string
        }
      }
    }>
  }
}

export interface StripeSubscriptionsResponse {
  subscriptions: StripeSubscription[]
}

export interface CustomerPortalRequest {
  customerEmail: string
  returnUrl: string
}

export interface CustomerPortalResponse {
  url: string
}

export interface StripeCheckoutSession {
  id: string
  status: string
  payment_status: string
  customer: {
    id: string
    email: string
  }
  subscription?: {
    id: string
    status: string
    current_period_end: number
  }
  amount_total: number
  currency: string
}

export interface OrganizationUsage {
  plan_name: string
  members: {
    current: number
    limit: number | null
    percentage: number
  }
  units: {
    current: number
    limit: number | null
    percentage: number
  }
  applicants: {
    current: number
    limit: number | null
    percentage: number
  }
  storage: {
    current: number
    limit: number | null
    percentage: number
  }
}

export interface CanCreateResourceResponse {
  allowed: boolean
  reason?: string
  current?: number
  limit?: number | null
}

// ============ API FUNCTIONS ============

/**
 * Lista produtos/planos disponíveis no Stripe
 */
export async function getStripeProducts(): Promise<StripeProduct[]> {
  const response = await api.get('stripe/products').json<StripeProduct[]>()
  return response
}

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createStripeCheckout(
  data: StripeCheckoutRequest
): Promise<StripeCheckoutResponse> {
  const response = await api
    .post('stripe/checkout', { json: data })
    .json<StripeCheckoutResponse>()
  return response
}

/**
 * Obtém detalhes de uma sessão de checkout
 */
export async function getStripeCheckoutSession(sessionId: string) {
  const response = await api
    .get(`stripe/checkout/${sessionId}`)
    .json<StripeCheckoutSession>()
  return response
}

/**
 * Lista preços disponíveis no Stripe
 */
export async function getStripePrices(): Promise<StripePrice[]> {
  const response = await api.get('stripe/prices').json<StripePrice[]>()
  return response
}

/**
 * Cancela uma assinatura
 */
export async function cancelStripeSubscription(
  subscriptionId: string,
  immediately = false
): Promise<StripeSubscription> {
  const response = await api
    .post(`stripe/subscriptions/${subscriptionId}/cancel`, {
      json: { immediately },
    })
    .json<StripeSubscription>()
  return response
}

/**
 * Obtém uso atual da organização
 */
export async function getOrganizationUsage(
  organizationId: string
): Promise<OrganizationUsage> {
  const response = await api
    .get(`organizations/${organizationId}/usage`)
    .json<OrganizationUsage>()
  return response
}

/**
 * Verifica se pode criar um recurso
 */
export async function canCreateResource(
  organizationId: string,
  resourceType: 'member' | 'unit' | 'demand'
): Promise<CanCreateResourceResponse> {
  const response = await api
    .get(`organizations/${organizationId}/can-create/${resourceType}`)
    .json<CanCreateResourceResponse>()
  return response
}

/**
 * Lista assinaturas do cliente
 */
export async function getStripeSubscriptions(
  customerEmail: string
): Promise<StripeSubscriptionsResponse> {
  const response = await api
    .get('stripe/subscriptions', {
      searchParams: { customerEmail },
    })
    .json<StripeSubscriptionsResponse>()
  return response
}

/**
 * Cria URL do Customer Portal do Stripe
 */
export async function createCustomerPortal(
  data: CustomerPortalRequest
): Promise<CustomerPortalResponse> {
  const response = await api
    .post('stripe/customer-portal', { json: data })
    .json<CustomerPortalResponse>()
  return response
}
