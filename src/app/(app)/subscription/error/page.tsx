'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, AlertCircle } from 'lucide-react'

export default function SubscriptionErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = searchParams.get('error_message')

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Erro no Pagamento</CardTitle>
          <CardDescription>
            Não foi possível processar sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-center text-sm text-muted-foreground">
            Ocorreu um problema ao processar seu pagamento. Por favor, verifique suas informações e tente novamente.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/subscription')} className="w-full">
              Tentar Novamente
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
