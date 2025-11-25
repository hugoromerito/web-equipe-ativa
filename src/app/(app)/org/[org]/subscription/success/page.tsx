'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { getStripeCheckoutSession } from '@/http/stripe-simple'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ org: string }>()
  const organizationSlug = params?.org
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const validatePayment = async () => {
      if (!sessionId) {
        setError('ID da sessão não encontrado')
        setLoading(false)
        return
      }

      try {
        const data = await getStripeCheckoutSession(sessionId)
        setSessionData(data)
        
        // Aguardar webhook processar
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      } catch (err) {
        console.error('Erro ao validar pagamento:', err)
        setError('Não foi possível validar o pagamento')
        setLoading(false)
      }
    }

    validatePayment()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Processando Pagamento...</CardTitle>
            <CardDescription>
              Aguarde enquanto confirmamos sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Isso pode levar alguns instantes. Não feche esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-10 w-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Atenção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Seu pagamento pode ter sido processado. Verifique sua assinatura ou entre em contato com o suporte.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push(`/org/${organizationSlug}/subscription`)} className="w-full">
                Ver Assinatura
              </Button>
              <Button onClick={() => router.push(`/org/${organizationSlug}`)} variant="outline" className="w-full">
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua assinatura foi ativada com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionData && (
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-sm">
              {sessionData.amount_total && (
                <p className="mb-2">
                  <strong>Valor pago:</strong>{' '}
                  {(sessionData.amount_total / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: sessionData.currency?.toUpperCase() || 'BRL',
                  })}
                </p>
              )}
              {sessionData.customer_details?.email && (
                <p>
                  <strong>Email:</strong> {sessionData.customer_details.email}
                </p>
              )}
            </div>
          )}
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Obrigado por assinar! Você já pode aproveitar todos os recursos do seu plano.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/org/${organizationSlug}/subscription`)} className="w-full">
              Ver Detalhes da Assinatura
            </Button>
            <Button onClick={() => router.push(`/org/${organizationSlug}`)} variant="outline" className="w-full">
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
