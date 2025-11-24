'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

// Verifica se a chave está configurada antes de tentar carregar
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

const stripePromise = publishableKey && publishableKey.length > 0
  ? loadStripe(publishableKey)
  : null

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!publishableKey || publishableKey.length === 0) {
      setError('Chave pública do Stripe não configurada')
      return
    }

    if (stripePromise) {
      stripePromise
        .then((stripeInstance) => {
          setStripe(stripeInstance)
        })
        .catch((err) => {
          console.error('Erro ao carregar Stripe:', err)
          setError('Erro ao carregar Stripe')
        })
    }
  }, [])

  // Mostrar erro se chave não estiver configurada
  if (error || !publishableKey) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Stripe não configurado</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            A chave pública do Stripe não está configurada. 
            {process.env.NODE_ENV === 'development' && (
              <span className="ml-1">
                Configure no arquivo <code className="text-xs">.env.local</code>
              </span>
            )}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 rounded bg-muted p-2 text-xs">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
            </pre>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  // Mostrar loading enquanto carrega
  if (!stripe) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Carregando Stripe...</div>
  }

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#0070f3',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }
    : undefined

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  )
}
