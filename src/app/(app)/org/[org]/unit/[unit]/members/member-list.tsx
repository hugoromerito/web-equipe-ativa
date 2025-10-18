import { ArrowLeftRight, Crown, UserMinus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Users, Shield, UserPlus } from 'lucide-react'

import { ability, getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'
import { translateRole } from '@/constants/role-translations'
import { organizationSchema } from '@/lib/auth/models/organization'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CreateInviteDialog } from '@/components/create-invite-dialog'


export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    await getMembers({ organizationSlug: currentOrg!, unitSlug: currentUnit! }),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  function getRoleColor(role: string | undefined | null) {
    if (!role) {
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    switch (role.toLowerCase()) {
      case 'owner':
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'manager':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'clerk':
      case 'analyst':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'billing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalMembers = members.length
  const activeMembers = members.filter(m => m.isOnline).length
  const adminCount = members.filter(m => m.unitRole === 'ADMIN').length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Equipe Médica
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Gerencie os membros da sua equipe médica, controle permissões e convide novos profissionais para o setor.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="btn-medical-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {permissions?.can('create', 'Invite') && (
              <CreateInviteDialog
                organizationSlug={currentOrg!}
                unitSlug={currentUnit!}
              />
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="medical-card medical-hover-lift">
            <CardContent className="medical-stat">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="medical-stat-label">Total de Membros</p>
                  <p className="medical-stat-value">{totalMembers}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="medical-card medical-hover-lift">
            <CardContent className="medical-stat">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="medical-stat-label">Membros Ativos</p>
                  <p className="medical-stat-value text-green-600">{activeMembers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-background"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="medical-card medical-hover-lift">
            <CardContent className="medical-stat">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="medical-stat-label">Administradores</p>
                  <p className="medical-stat-value text-purple-600">{adminCount}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar membros da equipe médica..."
              className="medical-form-input pl-12 h-12 text-base"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-56 h-12 medical-form-input">
              <SelectValue placeholder="Filtrar por cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Gestor</SelectItem>
              <SelectItem value="CLERK">Assistente</SelectItem>
              <SelectItem value="ANALYST">Analista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <Card 
            key={member.id} 
            className="medical-card-interactive medical-hover-lift animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      {member.avatarUrl && (
                        <AvatarImage src={member.avatarUrl} />
                      )}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-semibold">
                        {member.name && getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-foreground truncate">
                        {member.name}
                      </h3>
                      {member.userId === membership.userId && (
                        <Badge className="badge-medical-primary text-xs">
                          Você
                        </Badge>
                      )}
                      {organization.ownerId === member.userId && (
                        <Badge className="badge-medical-warning text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 medical-button-ghost hover:bg-primary/5">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="medical-dropdown">
                    <DropdownMenuItem className="medical-dropdown-item">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="medical-dropdown-item">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Alterar Setor
                    </DropdownMenuItem>
                    <DropdownMenuItem className="medical-dropdown-item text-red-600 hover:bg-red-50 hover:text-red-700">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Cargo:</span>
                  <Badge className={`${getRoleColor(member.unitRole)} font-medium`}>
                    {translateRole(member.unitRole)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        member.isOnline ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      {member.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Último acesso:</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {member.isOnline ? 'Online agora' : member.lastSeen ? formatDistanceToNow(new Date(member.lastSeen), { addSuffix: true, locale: ptBR }) : 'Nunca'}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-3">
                {permissions?.can('transfer_ownership', authOrganization) && (
                  <Button size="sm" variant="outline" className="flex-1 medical-button-secondary">
                    <ArrowLeftRight className="h-4 w-4 mr-1.5" />
                    Alterar
                  </Button>
                )}
                
                {permissions?.can('delete', 'User') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 medical-button-danger"
                    disabled={
                      member.userId === membership.userId ||
                      member.userId === organization.ownerId
                    }
                  >
                    <UserMinus className="h-4 w-4 mr-1.5" />
                    Remover
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <Card className="medical-card medical-fade-in text-center py-16">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-12 w-12 text-primary" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">Nenhum membro encontrado</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Este setor ainda não possui membros cadastrados. 
                Comece convidando profissionais para sua equipe médica.
              </p>
            </div>

            {permissions?.can('create', 'Invite') && (
              <CreateInviteDialog
                organizationSlug={currentOrg!}
                unitSlug={currentUnit!}
              />
            )}

            <div className="flex items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Convites por email</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Controle de acesso</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}