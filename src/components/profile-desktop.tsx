import { Building2, ChevronDown, Eye, FileText, LogOut, Users, UserCheck, UserPlus2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getCurrentOrg, getCurrentUnit, getCurrentPendingInvites } from '@/lib/auth'

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
  return initials
}

export async function ProfileDesktop() {
  const { user } = await auth()
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  
  let pendingInvites: Awaited<ReturnType<typeof getCurrentPendingInvites>> = []
  
  try {
    pendingInvites = await getCurrentPendingInvites()
  } catch (error) {
    // Se não há autenticação, apenas retorna lista vazia
    console.log('No pending invites available (user not authenticated)')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
        <Avatar className="size-10">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Convites pendentes - sempre disponível */}
        <DropdownMenuItem asChild>
          <Link 
            href={currentOrg ? `/org/${currentOrg}/invites` : '/invites'} 
            className="flex items-center gap-2"
          >
            <div className="relative">
              <UserPlus2 className="size-4" />
              {pendingInvites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
                  {pendingInvites.length}
                </span>
              )}
            </div>
            Convites
            {pendingInvites.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">
                ({pendingInvites.length})
              </span>
            )}
          </Link>
        </DropdownMenuItem>

        {/* Separador se houver convites ou organização */}
        {(pendingInvites.length > 0 || currentOrg) && <DropdownMenuSeparator />}
        
        {/* Opções disponíveis quando há organização selecionada */}
        {currentOrg && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/org/${currentOrg}`} className="flex items-center gap-2">
                <Building2 className="size-4" />
                Setores
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href={`/org/${currentOrg}/patients`} className="flex items-center gap-2">
                <UserCheck className="size-4" />
                Pacientes
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Opções disponíveis quando há organização E unidade selecionadas */}
        {currentOrg && currentUnit && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`} className="flex items-center gap-2">
                <FileText className="size-4" />
                Registrar Consultas
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href={`/org/${currentOrg}/unit/${currentUnit}/demands`} className="flex items-center gap-2">
                <Eye className="size-4" />
                Visualizar Consultas
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href={`/org/${currentOrg}/unit/${currentUnit}/members`} className="flex items-center gap-2">
                <Users className="size-4" />
                Visualizar Membros
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
