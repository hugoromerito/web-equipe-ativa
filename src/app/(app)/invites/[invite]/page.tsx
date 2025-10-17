import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, isAuthenticated } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInviteServer } from '@/http/server/accept-invite'
import { rejectInviteServer } from '@/http/server/reject-invite'
import { getPendingInvitesServer } from '@/http/server/get-pending-invites'

dayjs.extend(relativeTime).locale('pt-br')

interface InvitePageProps {
  params: {
    invite: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { invite: inviteId } = await params
  
  console.log('🔍 Página de convite iniciada para ID:', inviteId)
  
  // Primeiro, vamos buscar na lista de convites pendentes para descobrir a organização
  let invite: {
    id: string
    email: string
    role: any
    createdAt: string
    unit: {
      name: string
      organization: {
        name: string
      }
    } | null
    author: {
      name: string | null
      id: string
      avatarUrl: string | null
    } | null
  } | null = null
  let errorMessage = ''
  
  try {
    console.log('🔍 Buscando na lista de convites pendentes para descobrir organização...')
    const { invites } = await getPendingInvitesServer()
    const foundInvite = invites.find((inv) => inv.id === inviteId)
    
    if (foundInvite && foundInvite.unit?.organization?.name) {
      // Temos a organização, agora vamos buscar o convite completo
      console.log('🔍 Convite encontrado na lista, organização:', foundInvite.unit.organization.name)
      
      // Precisamos do slug da organização, mas temos só o nome
      // Por enquanto, vamos usar os dados da lista de convites pendentes
      invite = {
        id: foundInvite.id,
        email: foundInvite.email,
        role: foundInvite.role,
        createdAt: foundInvite.createdAt,
        unit: foundInvite.unit,
        author: foundInvite.author
      }
      
      console.log('✅ Usando dados da lista de convites pendentes:', invite.id)
    } else {
      console.log('❌ Convite não encontrado na lista de pendentes')
      errorMessage = 'Convite não encontrado ou já foi processado'
    }
  } catch (error) {
    console.error('❌ Erro ao buscar convites pendentes:', error)
    errorMessage = error instanceof Error ? error.message : 'Erro ao buscar convites'
  }
  
  // Se não conseguiu buscar o convite, mostrar página de erro
  if (!invite) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col justify-center space-y-6 text-center">
          <h1 className="text-2xl font-bold text-medical-red-600">Convite não encontrado</h1>
          <p className="text-muted-foreground">
            Este convite pode ter expirado, já foi aceito/rejeitado, ou não existe mais.
          </p>
          {errorMessage && (
            <div className="text-xs text-medical-red-500 bg-medical-red-50 p-2 rounded">
              Erro técnico: {errorMessage}
            </div>
          )}
          <Button asChild>
            <Link href="/">Voltar para tela inicial</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const isUserAuthenticated = isAuthenticated()

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  let currentUserEmail = null

  if (await isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite?.email

  async function signInFromInvite() {
    'use server'
    // ;(await cookies()).set('inviteId', inviteId)

    redirect(`/auth/sign-in?email=${invite?.email}`)
  }

  async function acceptInviteAction() {
    'use server'

    await acceptInviteServer(inviteId)

    redirect('/')
  }
  async function rejectInviteAction() {
    'use server'

    await rejectInviteServer(inviteId)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite?.author?.avatarUrl && (
              <AvatarImage src={invite?.author.avatarUrl} />
            )}
            {invite?.author?.name && (
              <AvatarFallback>
                {getInitials(invite?.author?.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="text-foreground font-medium">
              {invite?.author?.name ?? 'Someone'}
            </span>{' '}
            convidou você para participar da organização{' '}
            <span className="text-foreground font-medium">
              {invite?.unit?.organization.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(invite?.createdAt).fromNow()}
            </span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Entre para aceitar o convite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="flex flex-col space-y-4">
            <form action={acceptInviteAction}>
              <Button type="submit" variant="secondary" className="w-full">
                <CheckCircle className="mr-2 size-4" />
                Juntar-se {invite.unit?.organization.name}
              </Button>
            </form>
            <form action={rejectInviteAction}>
              <Button type="submit" variant="destructive" className="w-full">
                <X className="mr-2 size-4" />
                Recusar convite
              </Button>
            </form>
          </div>
        )}

        {(await isUserAuthenticated) &&
          !userIsAuthenticatedWithSameEmailFromInvite && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center text-sm leading-relaxed text-balance">
                Este convite foi enviado para{' '}
                <span className="text-foreground font-medium">
                  {invite?.email}
                </span>{' '}
                mas você está atualmente autenticado como{' '}
                <span className="text-foreground font-medium">
                  {currentUserEmail}
                </span>
                .
              </p>

              <div className="space-y-2">
                <Button className="w-full" variant="secondary" asChild>
                  <a href="/api/auth/sign-out">
                    <LogOut className="mr-2 size-4" />
                    Sair {currentUserEmail}
                  </a>
                </Button>

                <Button className="w-full" variant="outline" asChild>
                  <Link href="/">Voltar para tela inicial</Link>
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
