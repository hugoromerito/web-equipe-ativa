'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useOrganizationInvites,
  useCreateInvite,
  usePendingInvites,
  useAcceptInvite,
  useRejectInvite,
} from '@/hooks/use-invites'
import { ROLE_OPTIONS } from '@/constants/role-translations'
import { Loader2, Mail, Plus, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function InvitesPage() {
  const params = useParams<{ org: string }>()
  const organizationSlug = params.org

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)

  const { data: invitesData, isLoading } = useOrganizationInvites({
    organizationSlug,
    page,
    pageSize: 20,
  })

  const { data: pendingInvites, isLoading: isLoadingPending } =
    usePendingInvites()

  const createInvite = useCreateInvite()
  const acceptInvite = useAcceptInvite()
  const rejectInvite = useRejectInvite()

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !role) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await createInvite.mutateAsync({
        organizationSlug,
        email,
        role: role as 'ADMIN' | 'MEMBER' | 'BILLING',
      })

      toast.success('Convite enviado com sucesso')
      setIsCreateOpen(false)
      setEmail('')
      setRole('')
    } catch (error) {
      toast.error('Erro ao enviar convite')
    }
  }

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite.mutateAsync(inviteId)
      toast.success('Convite aceito com sucesso')
    } catch (error) {
      toast.error('Erro ao aceitar convite')
    }
  }

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite.mutateAsync(inviteId)
      toast.success('Convite recusado')
    } catch (error) {
      toast.error('Erro ao recusar convite')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
          <p className="text-muted-foreground">
            Gerencie convites da organização
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Enviar Convite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateInvite}>
              <DialogHeader>
                <DialogTitle>Enviar Convite</DialogTitle>
                <DialogDescription>
                  Convide um novo membro para a organização
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">
                    Função <span className="text-destructive">*</span>
                  </Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createInvite.isPending}>
                  {createInvite.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Enviar Convite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger value="sent">
            <Mail className="mr-2 h-4 w-4" />
            Enviados
          </TabsTrigger>
          <TabsTrigger value="received">
            <Mail className="mr-2 h-4 w-4" />
            Recebidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Enviado em</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitesData?.invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                          {invite.email}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                            {ROLE_OPTIONS.find((r) => r.value === invite.role)
                              ?.label || invite.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(
                            new Date(invite.created_at),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Pendente
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}

                    {invitesData?.invites.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum convite enviado
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {invitesData &&
                invitesData.totalCount > 20 &&
                Math.ceil(invitesData.totalCount / 20) > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Página {page} de{' '}
                      {Math.ceil(invitesData.totalCount / 20)} (
                      {invitesData.totalCount} convites)
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={
                          page >= Math.ceil(invitesData.totalCount / 20)
                        }
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
            </>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {isLoadingPending ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organização</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Recebido em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvites?.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">
                        {invite.organization.name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                          {ROLE_OPTIONS.find((r) => r.value === invite.role)
                            ?.label || invite.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(
                          new Date(invite.created_at),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptInvite(invite.id)}
                            disabled={acceptInvite.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aceitar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectInvite(invite.id)}
                            disabled={rejectInvite.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {pendingInvites?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-muted-foreground">
                          Nenhum convite pendente
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
