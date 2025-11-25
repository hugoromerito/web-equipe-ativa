'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useOrganizationUsage } from '@/hooks/use-stripe-simple'
import { Users, Building2, FileText, HardDrive, AlertTriangle, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UsageDashboardProps {
  organizationId: string
  organizationSlug?: string
}

export function UsageDashboard({ organizationId, organizationSlug }: UsageDashboardProps) {
  const router = useRouter()
  const { data: usage, isLoading, error } = useOrganizationUsage(organizationId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Carregando uso...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar uso</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as informações de uso. Verifique se você tem uma assinatura ativa.
        </AlertDescription>
      </Alert>
    )
  }

  if (!usage) return null

  const resources = [
    {
      icon: Users,
      label: 'Membros',
      data: usage.members,
      color: 'text-blue-600',
    },
    {
      icon: Building2,
      label: 'Unidades',
      data: usage.units,
      color: 'text-green-600',
    },
    {
      icon: FileText,
      label: 'Pacientes',
      data: usage.applicants,
      color: 'text-purple-600',
    },
    {
      icon: HardDrive,
      label: 'Armazenamento',
      data: usage.storage,
      color: 'text-orange-600',
      unit: 'GB',
    },
  ]

  const hasWarning = resources.some(r => r.data?.percentage && r.data.percentage >= 80)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Uso do Plano</h3>
          <p className="text-sm text-gray-500">{usage.plan_name}</p>
        </div>
        {hasWarning && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/org/${organizationSlug}/subscription`)}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </Button>
        )}
      </div>

      {/* Alert se próximo do limite */}
      {hasWarning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Você está próximo do limite em alguns recursos. Considere fazer upgrade do seu plano.
          </AlertDescription>
        </Alert>
      )}

      {/* Grid de recursos */}
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => {
          if (!resource.data) return null

          const Icon = resource.icon
          const percentage = resource.data.percentage ?? 0
          const isNearLimit = percentage >= 80
          const isAtLimit = percentage >= 100

          return (
            <Card key={resource.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${resource.color}`} />
                  <CardTitle className="text-base">{resource.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Uso atual</span>
                  <span className="font-medium">
                    {resource.data.current ?? 0}
                    {resource.unit && ` ${resource.unit}`}
                    {resource.data.limit !== null && resource.data.limit !== undefined && (
                      <span className="text-gray-500">
                        {' '}
                        / {resource.data.limit}
                        {resource.unit && ` ${resource.unit}`}
                      </span>
                    )}
                    {(resource.data.limit === null || resource.data.limit === undefined) && (
                      <span className="text-gray-500"> / ∞</span>
                    )}
                  </span>
                </div>

                {resource.data.limit !== null && resource.data.limit !== undefined && (
                  <>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        isAtLimit
                          ? '[&>div]:bg-red-500'
                          : isNearLimit
                          ? '[&>div]:bg-yellow-500'
                          : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {percentage}% utilizado
                    </p>
                  </>
                )}

                {isAtLimit && (
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Limite atingido
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
