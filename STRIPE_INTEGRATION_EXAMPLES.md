# Exemplos de Integração do Sistema de Billing

Este documento mostra como integrar o sistema de billing em diferentes partes da aplicação.

## 1. Verificar Limite ao Criar Membro

```tsx
// src/app/(app)/[slug]/members/create-member-button.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceLimitGuard } from '@/components/resource-limit-alert'
import { CreateMemberDialog } from './create-member-dialog'

interface CreateMemberButtonProps {
  organizationId: string
}

export function CreateMemberButton({ organizationId }: CreateMemberButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <ResourceLimitGuard
      organizationId={organizationId}
      resourceType="member"
    >
      <Button onClick={() => setOpen(true)}>
        Adicionar Membro
      </Button>
      <CreateMemberDialog open={open} onOpenChange={setOpen} />
    </ResourceLimitGuard>
  )
}
```

## 2. Verificar Limite ao Criar Unidade

```tsx
// src/app/(app)/[slug]/units/create-unit-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useCanCreateResource } from '@/hooks/use-billing'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export function CreateUnitButton({ organizationId }: { organizationId: string }) {
  const router = useRouter()
  const { data: canCreate } = useCanCreateResource(organizationId, 'unit')

  const handleClick = () => {
    if (!canCreate?.allowed) {
      toast({
        title: 'Limite atingido',
        description: canCreate?.reason || 'Você atingiu o limite de unidades do seu plano.',
        variant: 'destructive',
      })
      router.push('/subscription')
      return
    }

    // Proceed with creation
    router.push('/units/new')
  }

  return (
    <Button onClick={handleClick}>
      Nova Unidade
    </Button>
  )
}
```

## 3. Verificar Limite ao Criar Demanda

```tsx
// src/app/(app)/[slug]/demands/page.tsx
'use client'

import { ResourceLimitAlert } from '@/components/resource-limit-alert'
import { CreateDemandButton } from './create-demand-button'

export default function DemandsPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ResourceLimitAlert
        organizationId={params.slug}
        resourceType="demand"
      />
      
      <div className="flex justify-between">
        <h1>Demandas</h1>
        <CreateDemandButton organizationId={params.slug} />
      </div>
      
      {/* Lista de demandas */}
    </div>
  )
}
```

## 4. Exibir Status da Assinatura no Dashboard

```tsx
// src/app/(app)/[slug]/dashboard/subscription-widget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useOrganizationSubscription } from '@/hooks/use-billing'
import { useRouter } from 'next/navigation'
import { CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function SubscriptionWidget({ organizationId }: { organizationId: string }) {
  const router = useRouter()
  const { data: subscription, isLoading } = useOrganizationSubscription(organizationId)

  if (isLoading) return null

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Você ainda não possui uma assinatura ativa
          </p>
          <Button onClick={() => router.push('/subscription')}>
            Ver Planos
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assinatura</CardTitle>
          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
            {subscription.status === 'active' ? 'Ativa' : subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">{subscription.plan?.name}</p>
          <p className="text-xs text-muted-foreground">
            R$ {subscription.plan?.price_monthly.toFixed(2)}/mês
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4" />
          <span>
            Próxima cobrança:{' '}
            {format(new Date(subscription.current_period_end), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => router.push('/subscription')}
        >
          Gerenciar Assinatura
        </Button>
      </CardContent>
    </Card>
  )
}
```

## 5. Mostrar Uso de Recursos

```tsx
// src/app/(app)/[slug]/dashboard/usage-widget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useOrganizationSubscription, useSubscriptionUsage } from '@/hooks/use-billing'
import { Users, Building2, FileText, HardDrive } from 'lucide-react'

export function UsageWidget({ organizationId }: { organizationId: string }) {
  const { data: subscription } = useOrganizationSubscription(organizationId)
  const { data: usage, isLoading } = useSubscriptionUsage(subscription?.id || '')

  if (isLoading || !usage) return null

  const icons = {
    member: Users,
    unit: Building2,
    demand: FileText,
    storage: HardDrive,
  }

  const labels = {
    member: 'Membros',
    unit: 'Unidades',
    demand: 'Demandas',
    storage: 'Armazenamento',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de Recursos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usage.map((record) => {
          const Icon = icons[record.resource_type]
          const percentage = record.percentage_used || 0

          return (
            <div key={record.resource_type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{labels[record.resource_type]}</span>
                </div>
                <span className="font-medium">
                  {record.current_usage}
                  {record.limit !== null && ` / ${record.limit}`}
                  {record.resource_type === 'storage' && ' GB'}
                </span>
              </div>
              {record.limit !== null && (
                <Progress value={percentage} className="h-2" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
```

## 6. Middleware de Verificação de Assinatura

```tsx
// src/middleware/check-subscription.ts
import { useOrganizationSubscription } from '@/hooks/use-billing'
import { redirect } from 'next/navigation'

export async function checkActiveSubscription(organizationId: string) {
  const { data: subscription } = useOrganizationSubscription(organizationId)

  if (!subscription || subscription.status !== 'active') {
    redirect('/subscription')
  }

  return subscription
}
```

## 7. Guard para Upload de Arquivos

```tsx
// src/app/(app)/[slug]/documents/upload-document.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useOrganizationSubscription, useSubscriptionUsage } from '@/hooks/use-billing'
import { toast } from '@/hooks/use-toast'
import { Upload } from 'lucide-react'

export function UploadDocument({ organizationId }: { organizationId: string }) {
  const [uploading, setUploading] = useState(false)
  const { data: subscription } = useOrganizationSubscription(organizationId)
  const { data: usage } = useSubscriptionUsage(subscription?.id || '')

  const handleUpload = async (file: File) => {
    // Check storage limit
    const storageUsage = usage?.find(u => u.resource_type === 'storage')
    if (storageUsage) {
      const fileSizeGB = file.size / (1024 * 1024 * 1024)
      const availableGB = (storageUsage.limit || 0) - storageUsage.current_usage

      if (fileSizeGB > availableGB) {
        toast({
          title: 'Limite de armazenamento atingido',
          description: `Você não tem espaço suficiente. Disponível: ${availableGB.toFixed(2)} GB`,
          variant: 'destructive',
        })
        return
      }
    }

    setUploading(true)
    try {
      // Upload logic here
      await uploadFile(file)
      toast({
        title: 'Upload concluído',
        description: 'Arquivo enviado com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o arquivo.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Button onClick={() => handleUpload()} disabled={uploading}>
      <Upload className="mr-2 h-4 w-4" />
      {uploading ? 'Enviando...' : 'Upload'}
    </Button>
  )
}
```

## 8. Notificação de Trial Ending

```tsx
// src/components/trial-ending-alert.tsx
'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useOrganizationSubscription } from '@/hooks/use-billing'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { differenceInDays } from 'date-fns'

export function TrialEndingAlert({ organizationId }: { organizationId: string }) {
  const router = useRouter()
  const { data: subscription } = useOrganizationSubscription(organizationId)

  if (!subscription?.trial_end) return null

  const daysLeft = differenceInDays(new Date(subscription.trial_end), new Date())

  if (daysLeft > 7 || daysLeft < 0) return null

  return (
    <Alert variant={daysLeft <= 3 ? 'destructive' : 'default'}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {daysLeft === 0 ? 'Último dia de trial!' : `${daysLeft} dias restantes do trial`}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          Adicione um método de pagamento para continuar usando após o período de teste.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/subscription')}
        >
          Adicionar Pagamento
        </Button>
      </AlertDescription>
    </Alert>
  )
}
```

## 9. Badge de Plano no Header

```tsx
// src/components/org-header.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { useOrganizationSubscription } from '@/hooks/use-billing'

export function OrgHeader({ organizationId }: { organizationId: string }) {
  const { data: subscription } = useOrganizationSubscription(organizationId)

  return (
    <div className="flex items-center gap-2">
      <h1>Minha Organização</h1>
      {subscription?.plan && (
        <Badge variant="secondary">
          {subscription.plan.name}
        </Badge>
      )}
    </div>
  )
}
```

## 10. Botão de Upgrade Contextual

```tsx
// src/components/upgrade-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

interface UpgradeButtonProps {
  feature: string
  className?: string
}

export function UpgradeButton({ feature, className }: UpgradeButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => router.push('/subscription?highlight=upgrade')}
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Upgrade para usar {feature}
    </Button>
  )
}
```

## Uso nas Páginas

```tsx
// src/app/(app)/[slug]/page.tsx
import { TrialEndingAlert } from '@/components/trial-ending-alert'
import { SubscriptionWidget } from './dashboard/subscription-widget'
import { UsageWidget } from './dashboard/usage-widget'

export default function DashboardPage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-6 p-6">
      <TrialEndingAlert organizationId={params.slug} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <SubscriptionWidget organizationId={params.slug} />
        <UsageWidget organizationId={params.slug} />
      </div>

      {/* Resto do dashboard */}
    </div>
  )
}
```

## Dicas de Integração

1. **Sempre verifique limites antes de criar recursos**
2. **Use ResourceLimitGuard para proteger ações**
3. **Exiba alertas quando trial está acabando**
4. **Mostre uso de recursos no dashboard**
5. **Adicione botões de upgrade contextuais**
6. **Use badges para mostrar plano atual**
7. **Implemente redirecionamento para /subscription quando limite atingido**
