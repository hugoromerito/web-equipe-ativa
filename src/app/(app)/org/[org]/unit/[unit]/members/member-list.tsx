import { ArrowLeftRight, Crown, UserMinus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Users, Shield } from 'lucide-react'

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

  function getRoleColor(role: string) {
    switch (orgRole.toLowerCase()) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'gestor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assistente':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'analista':
        return 'bg-blue-100 text-blue-800 border-blue-200'

        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalMembers = members.length
  const activeMembers = members.filter(m => m.isOnline).length
  const adminCount = members.filter(m => m.unitRole === 'ADMIN').length

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Membros da Equipe</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os membros da sua organização e suas permissões
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Convidar Membro
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Membros</p>
                  <p className="text-2xl font-bold">{totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membros Ativos</p>
                  <p className="text-2xl font-bold">{activeMembers}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">{adminCount}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros por nome ou email..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Gestor</SelectItem>
              <SelectItem value="member">Assistente</SelectItem>
              <SelectItem value="member">Analista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {member.avatarUrl && (
                      <AvatarImage src={member.avatarUrl} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {member.name && getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg leading-none">
                        {member.name}
                      </h3>
                      {member.userId === membership.userId && (
                        <Badge variant="secondary" className="text-xs">
                          Você
                        </Badge>
                      )}
                      {organization.ownerId === member.userId && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {member.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Alterar Unidade
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cargo:</span>
                  <Badge className={getRoleColor(member.unitRole)}>
                    {translateRole(member.unitRole)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="flex items-center gap-1">
    <div
      className={`h-2 w-2 rounded-full ${
        member.isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
    />
    <span
      className={`text-sm ${
        member.isOnline ? 'text-green-600' : 'text-muted-foreground'
      }`}
    >
      {member.isOnline ? 'Online' : 'Offline'}
    </span>
  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Último acesso:</span>
                  <span className="text-sm text-muted-foreground">
                    {member.isOnline ? 'Online agora' : member.lastSeen ? formatDistanceToNow(new Date(member.lastSeen), { addSuffix: true, locale: ptBR }) : 'Nunca'}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                {permissions?.can('transfer_ownership', authOrganization) && (
                  <Button size="sm" variant="outline" className="flex-1 mr-2">
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Alterar
                  </Button>
                )}
                
                {permissions?.can('delete', 'User') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    disabled={
                      member.userId === membership.userId ||
                      member.userId === organization.ownerId
                    }
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
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
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece convidando membros para sua organização
            </p>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Convidar Primeiro Membro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}