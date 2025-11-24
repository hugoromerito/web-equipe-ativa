'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type PaymentMethod } from '@/http/billing'
import { CreditCard, Trash2, Star } from 'lucide-react'
import { useState } from 'react'

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod
  onSetDefault?: (id: string) => void
  onDelete?: (id: string) => void
  isDeleting?: boolean
  isSettingDefault?: boolean
}

export function PaymentMethodCard({
  paymentMethod,
  onSetDefault,
  onDelete,
  isDeleting = false,
  isSettingDefault = false,
}: PaymentMethodCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getCardBrandIcon = (brand: string | null) => {
    if (!brand) return null

    const brandLogos: Record<string, string> = {
      visa: '💳 Visa',
      mastercard: '💳 Mastercard',
      amex: '💳 Amex',
      discover: '💳 Discover',
      diners: '💳 Diners',
      jcb: '💳 JCB',
      unionpay: '💳 UnionPay',
    }

    return brandLogos[brand.toLowerCase()] || '💳'
  }

  const handleDelete = () => {
    onDelete?.(paymentMethod.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className={paymentMethod.is_default ? 'border-primary' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <div>
                <CardTitle className="text-base">
                  {getCardBrandIcon(paymentMethod.card_brand)}{' '}
                  •••• {paymentMethod.card_last4}
                </CardTitle>
                <CardDescription className="text-xs">
                  Expira em {paymentMethod.card_exp_month}/
                  {paymentMethod.card_exp_year}
                </CardDescription>
              </div>
            </div>
            {paymentMethod.is_default && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                Padrão
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex gap-2">
          {!paymentMethod.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault?.(paymentMethod.id)}
              disabled={isSettingDefault}
            >
              Definir como padrão
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover método de pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este cartão? Esta ação não pode
              ser desfeita.
              {paymentMethod.is_default && (
                <p className="mt-2 font-medium text-destructive">
                  Este é seu método de pagamento padrão. Você precisará definir
                  outro como padrão.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[]
  onSetDefault?: (id: string) => void
  onDelete?: (id: string) => void
  onAddNew?: () => void
  isLoading?: boolean
}

export function PaymentMethodsList({
  paymentMethods,
  onSetDefault,
  onDelete,
  onAddNew,
  isLoading = false,
}: PaymentMethodsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id)
    await onSetDefault?.(id)
    setSettingDefaultId(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await onDelete?.(id)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">
            Nenhum método de pagamento cadastrado
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Adicione um cartão para facilitar seus pagamentos
          </p>
          <Button onClick={onAddNew}>Adicionar Cartão</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          paymentMethod={method}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
          isDeleting={deletingId === method.id}
          isSettingDefault={settingDefaultId === method.id}
        />
      ))}

      <Button variant="outline" className="w-full" onClick={onAddNew}>
        <CreditCard className="mr-2 h-4 w-4" />
        Adicionar Novo Cartão
      </Button>
    </div>
  )
}
