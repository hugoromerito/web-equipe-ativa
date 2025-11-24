import { api } from './api-client'

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
  const result = await api.get('plans').json<{ plans: Plan[] }>()
  return result
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
}

export async function createSubscription(data: CreateSubscriptionRequest) {
  const result = await api
    .post('subscriptions', { json: data })
    .json<CreateSubscriptionResponse>()
  return result
}

export async function getOrganizationSubscription(organizationId: string) {
  const result = await api
    .get(`organizations/${organizationId}/subscription`)
    .json<{ subscription: Subscription | null }>()
  return result
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
  const result = await api
    .get(`organizations/${organizationId}/payment-methods`)
    .json<{ payment_methods: PaymentMethod[] }>()
  return result
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
