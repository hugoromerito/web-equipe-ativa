import { Flag, MapPin, Building2, ArrowRight, Search } from 'lucide-react'

import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrganizations } from '@/http/get-organizations'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export async function OrgList() {
  const currentOrg = await getCurrentOrg()
  
  let organizations: any[] = []
  let currentOrganization: any = null
  
  try {
    const response = await getOrganizations()
    organizations = response.organizations
    currentOrganization = organizations.find(
      (org) => org.slug === currentOrg,
    )
  } catch (error) {
    // Se não há autenticação, exibe mensagem de login
    console.log('No organizations available (user not authenticated)')
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acesso necessário</h2>
          <p className="text-muted-foreground">Faça login para ver suas organizações</p>
        </div>
        <Link href="/auth/sign-in">
          <Button>Fazer Login</Button>
        </Link>
      </div>
    )
  }

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  return (
    <div className="space-y-8">
      {organizations.length === 0 ? (
        /* Empty State Médico */
        <div className="medical-card p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Nenhuma organização encontrada
          </h3>
          <p className="text-muted-foreground mb-6">
            Você ainda não faz parte de nenhuma organização de saúde. Crie uma nova ou aguarde um convite.
          </p>
          <Link href="/create-organization">
            <Button className="btn-medical-primary">
              <Building2 className="w-4 h-4 mr-2" />
              Criar primeira organização
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and Actions Médicos */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text"
                placeholder="Buscar organizações de saúde..." 
                className="medical-form-input pl-10"
              />
            </div>
            <Link href="/create-organization">
              <Button className="btn-medical-secondary inline-flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Nova organização
              </Button>
            </Link>
          </div>

          {/* Organizations Grid Médico */}
          <div className="grid gap-4">
            {organizations.map((organization, index) => (
              <Link 
                key={organization.id} 
                href={`org/${organization.slug}`}
                className="group block"
              >
                <div className={`medical-card-interactive p-6 ${
                  organization.slug === currentOrg 
                    ? 'border-l-4 border-l-primary bg-primary/5' 
                    : ''
                } animate-slide-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Médico */}
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-2 ring-primary/20 group-hover:ring-primary/30 transition-colors">
                        {organization.avatarUrl && (
                          <AvatarImage src={organization.avatarUrl} />
                        )}
                        {organization.name && (
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {getInitials(organization.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {organization.slug === currentOrg && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <Flag className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content Médico */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {organization.name}
                          </h3>
                          
                          {/* Organization details */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" />
                              <span>Organização de Saúde</span>
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-2">
                            {organization.slug === currentOrg && (
                              <Badge className="badge-medical-success">
                                <Flag className="w-3 h-3 mr-1" />
                                Organização Atual
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer info Médico */}
          <div className="medical-card p-4 bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                {organizations.length} {organizations.length === 1 ? 'organização' : 'organizações'} de saúde
              </p>
              {currentOrganization && (
                <p className="text-muted-foreground">
                  Organização atual: <span className="font-medium text-foreground">{currentOrganization.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}