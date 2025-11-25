'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCanCreateResource } from '@/hooks/use-stripe-simple'

interface ResourceLimitAlertProps {
  organizationId: string
  organizationSlug?: string
  resourceType: 'member' | 'unit' | 'demand'
  onUpgrade?: () => void
}

const resourceLabels = {
  member: 'membros',
  unit: 'unidades',
  demand: 'demandas',
}

export function ResourceLimitAlert({
  organizationId,
  organizationSlug,
  resourceType,
  onUpgrade,
}: ResourceLimitAlertProps) {
  const router = useRouter()
  const { data, isLoading } = useCanCreateResource(organizationId, resourceType)

  if (isLoading || !data || data.allowed) {
    return null
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else if (organizationSlug) {
      router.push(`/org/${organizationSlug}/subscription`)
    } else {
      router.push('/subscription')
    }
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Limite Atingido</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>
          {data.reason || `Você atingiu o limite de ${resourceLabels[resourceType]} do seu plano.`}
          {data.current !== undefined && data.limit !== undefined && (
            <span className="ml-1">
              ({data.current}/{data.limit})
            </span>
          )}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpgrade}
          className="shrink-0 bg-white hover:bg-gray-50"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  )
}

interface ResourceLimitGuardProps {
  organizationId: string
  organizationSlug?: string
  resourceType: 'member' | 'unit' | 'demand'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ResourceLimitGuard({
  organizationId,
  organizationSlug,
  resourceType,
  children,
  fallback,
}: ResourceLimitGuardProps) {
  const { data, isLoading } = useCanCreateResource(organizationId, resourceType)

  if (isLoading) {
    return null
  }

  if (!data?.allowed) {
    return (
      fallback || (
        <ResourceLimitAlert
          organizationId={organizationId}
          organizationSlug={organizationSlug}
          resourceType={resourceType}
        />
      )
    )
  }

  return <>{children}</>
}

interface ResourceUsageBadgeProps {
  organizationId: string
  resourceType: 'member' | 'unit' | 'demand'
}

export function ResourceUsageBadge({ organizationId, resourceType }: ResourceUsageBadgeProps) {
  const { data, isLoading } = useCanCreateResource(organizationId, resourceType)

  if (isLoading || !data) return null

  const percentage = data.limit && data.current ? (data.current / data.limit) * 100 : 0

  const getColor = () => {
    if (percentage >= 100) return 'text-red-600 bg-red-50'
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {data.current}/{data.limit || '∞'}
    </span>
  )
}
