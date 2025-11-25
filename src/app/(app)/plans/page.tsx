'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PricingGrid } from '@/components/pricing-card'
import { usePlans } from '@/hooks/use-billing'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

/**
 * Página standalone de planos/checkout
 * Esta página permite compra direta via Stripe Checkout
 * sem necessidade de autenticação prévia
 */
export default function PlansPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  // Carregar planos disponíveis
  const { data: plans, isLoading: plansLoading, error: plansError } = usePlans()

  /**
   * Handler para seleção de plano
   * Redireciona para a página de login se não estiver autenticado
   * Ou cria uma assinatura e redireciona para checkout
   */
  const handleSelectPlan = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    setIsCreatingCheckout(true)

    try {
      // Verificar se tem token (está autenticado)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        // Redirecionar para login com redirect de volta para plans
        const loginUrl = `/auth/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`
        router.push(loginUrl)
        return
      }

      // Buscar o plano selecionado
      const selectedPlan = plans?.find(p => p.id === planId)
      
      if (!selectedPlan) {
        throw new Error('Plano não encontrado')
      }

      // Criar a assinatura (o backend deve retornar uma URL de checkout)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: billingCycle,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar assinatura')
      }

      const data = await response.json()

      // Se retornar URL, redirecionar
      if (data.url) {
        window.location.href = data.url
      } else {
        // Caso contrário, redirecionar para a página de subscription
        router.push('/subscription')
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      toast({
        title: 'Erro ao processar pagamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      setIsCreatingCheckout(false)
    }
  }

  if (plansLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Escolha o Plano Ideal
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Selecione o plano que melhor atende suas necessidades
        </p>
      </div>

      {/* Alertas de erro */}
      {plansError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro ao carregar planos:</strong> {' '}
            {plansError instanceof Error ? plansError.message : 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      )}

      {/* Grade de planos */}
      {plans && plans.length > 0 ? (
        <PricingGrid
          plans={plans}
          onSelectPlan={handleSelectPlan}
          disabled={isCreatingCheckout}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum plano disponível no momento
          </p>
        </div>
      )}

      {/* Informações adicionais */}
      <div className="mx-auto max-w-4xl space-y-6 rounded-lg border p-6">
        <h2 className="text-2xl font-bold">Perguntas Frequentes</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
            <p className="text-sm text-muted-foreground">
              Após selecionar um plano, você será redirecionado para o checkout seguro do Stripe, 
              onde poderá inserir seus dados de pagamento. Aceitamos todos os principais cartões 
              de crédito e débito.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode cancelar sua assinatura a qualquer momento através do painel de controle. 
              O cancelamento terá efeito no final do período de cobrança atual.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">É seguro?</h3>
            <p className="text-sm text-muted-foreground">
              Absolutamente. Todos os pagamentos são processados pelo Stripe, líder mundial em 
              segurança de pagamentos online. Não armazenamos dados de cartão de crédito em nossos 
              servidores.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Posso mudar de plano depois?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
              As alterações serão aplicadas imediatamente e o valor será ajustado proporcionalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
