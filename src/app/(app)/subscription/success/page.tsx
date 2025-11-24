'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentIntent = searchParams.get('payment_intent')

  useEffect(() => {
    // Opcional: validar o payment intent com o backend
    if (paymentIntent) {
      console.log('Payment Intent:', paymentIntent)
    }
  }, [paymentIntent])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
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
          <p className="text-center text-sm text-muted-foreground">
            Obrigado por assinar nosso serviço. Você já pode aproveitar todos os recursos do seu plano.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/subscription')} className="w-full">
              Ver Detalhes da Assinatura
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Voltar ao Início
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
