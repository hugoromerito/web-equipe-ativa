'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function SubscriptionCancelPage() {
  const router = useRouter()
  const params = useParams<{ org: string }>()

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <XCircle className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
          <CardDescription>
            O processo de pagamento foi cancelado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Você cancelou o processo de assinatura. Não se preocupe, você pode tentar novamente quando quiser.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/org/${params.org}/subscription`)} className="w-full">
              Voltar aos Planos
            </Button>
            <Button onClick={() => router.push(`/org/${params.org}`)} variant="outline" className="w-full">
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
