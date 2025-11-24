'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCanCreateResource } from '@/hooks/use-billing'

interface ResourceLimitAlertProps {
  organizationId: string
  resourceType: 'member' | 'unit' | 'demand'
  onUpgrade?: () => void
}

export function ResourceLimitAlert({
  organizationId,
  resourceType,
  onUpgrade,
}: ResourceLimitAlertProps) {
  const router = useRouter()
  const { data, isLoading } = useCanCreateResource(organizationId, resourceType)

  if (isLoading || !data || data.allowed) {
    return null
  }

  const resourceLabels = {
    member: 'membros',
    unit: 'unidades',
    demand: 'demandas',
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/subscription')
    }
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Limite Atingido</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {data.reason || `Você atingiu o limite de ${resourceLabels[resourceType]} do seu plano.`}
          {data.current_usage !== undefined && data.limit !== undefined && (
            <span className="ml-1">
              ({data.current_usage}/{data.limit})
            </span>
          )}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpgrade}
          className="ml-4 shrink-0"
        >
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  )
}

interface ResourceLimitGuardProps {
  organizationId: string
  resourceType: 'member' | 'unit' | 'demand'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ResourceLimitGuard({
  organizationId,
  resourceType,
  children,
  fallback,
}: ResourceLimitGuardProps) {
  const { data, isLoading } = useCanCreateResource(organizationId, resourceType)

  if (isLoading) {
    return null
  }

  if (!data?.allowed) {
    return fallback || <ResourceLimitAlert organizationId={organizationId} resourceType={resourceType} />
  }

  return <>{children}</>
}
