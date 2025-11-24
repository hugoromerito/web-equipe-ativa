'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

interface CheckoutFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  returnUrl?: string
}

export function CheckoutForm({
  onSuccess,
  onError,
  returnUrl,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message || 'Erro ao processar pagamento')
        onError?.(submitError.message || 'Erro ao processar pagamento')
        setIsProcessing(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            returnUrl ||
            `${window.location.origin}/subscription/success`,
        },
      })

      if (confirmError) {
        setError(
          confirmError.message ||
            'Erro ao confirmar pagamento. Tente novamente.'
        )
        onError?.(
          confirmError.message ||
            'Erro ao confirmar pagamento. Tente novamente.'
        )
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError('Erro inesperado ao processar pagamento')
      onError?.('Erro inesperado ao processar pagamento')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Pagamento</CardTitle>
        <CardDescription>
          Complete o pagamento para ativar sua assinatura
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <PaymentElement
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
            }}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Pagamento'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

interface SetupPaymentFormProps {
  onSuccess?: (paymentMethodId: string) => void
  onError?: (error: string) => void
}

export function SetupPaymentForm({
  onSuccess,
  onError,
}: SetupPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message || 'Erro ao processar método de pagamento')
        onError?.(submitError.message || 'Erro ao processar método de pagamento')
        setIsProcessing(false)
        return
      }

      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.origin,
        },
      })

      if (setupError) {
        setError(
          setupError.message ||
            'Erro ao adicionar método de pagamento. Tente novamente.'
        )
        onError?.(
          setupError.message ||
            'Erro ao adicionar método de pagamento. Tente novamente.'
        )
      } else if (setupIntent?.payment_method) {
        onSuccess?.(setupIntent.payment_method as string)
      }
    } catch (err) {
      setError('Erro inesperado ao processar método de pagamento')
      onError?.('Erro inesperado ao processar método de pagamento')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Método de Pagamento</CardTitle>
        <CardDescription>
          Adicione um cartão para facilitar pagamentos futuros
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Adicionar Cartão'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
