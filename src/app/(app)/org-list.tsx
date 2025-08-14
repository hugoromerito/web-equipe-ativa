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
  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  )

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Organizações
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Selecione uma organização para continuar ou crie uma nova
        </p>
      </div>

      {organizations.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
            <Building2 className="size-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma organização encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            Você ainda não faz parte de nenhuma organização. Crie uma nova ou aguarde um convite.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Building2 className="size-4 mr-2" />
            Criar primeira organização
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                placeholder="Buscar organizações..." 
                className="pl-10 h-10"
              />
            </div>
              <Link href="/create-organization">
            <Button variant="outline" className="shrink-0 cursor-pointer">
                           
              <Building2 className="size-4 mr-2" />
              Nova organização
            </Button>
                          </Link>
          </div>

          {/* Organizations Grid/List */}
          <div className="grid gap-3 md:gap-4">
            {organizations.map((organization) => (
              <Link 
                key={organization.id} 
                href={`org/${organization.slug}`}
                className="group"
              >
                <div className="relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="size-12 ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-colors">
                      {organization.avatarUrl && (
                        <AvatarImage src={organization.avatarUrl} />
                      )}
                      {organization.name && (
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                          {getInitials(organization.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {organization.slug === currentOrg && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <Flag className="size-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {organization.name}
                        </h3>
                        
                        {/* Organization details */}
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="size-3" />
                            <span>Organização</span>
                          </div>
                        </div>

                        {/* Organization type/role */}
                        <div className="flex items-center gap-2 mt-2">
                          {organization.slug === currentOrg && (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center">
                        <ArrowRight className="size-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {organizations.length} {organizations.length === 1 ? 'organização' : 'organizações'}
            </p>
            {currentOrganization && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Organização atual: <span className="font-medium text-gray-700 dark:text-gray-300">{currentOrganization.name}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}