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
    <div className="w-full medical-section">
      {/* Header Section Médico */}
      <div className="medical-section">
        <h1 className="medical-section-title">
          Central de Organizações
        </h1>
        <p className="medical-section-subtitle">
          Acesse suas organizações médicas ou crie uma nova unidade de saúde
        </p>
      </div>

      {organizations.length === 0 ? (
        /* Empty State Médico */
        <div className="medical-card p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Nenhuma organização encontrada
          </h3>
          <p className="text-slate-600 mb-6">
            Você ainda não faz parte de nenhuma organização de saúde. Crie uma nova ou aguarde um convite.
          </p>
          <Link href="/create-organization">
            <button className="btn-medical">
              <Building2 className="w-4 h-4 mr-2" />
              Criar primeira organização
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and Actions Médicos */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex-1 max-w-sm medical-search">
              <Search className="search-icon" size={18} />
              <input 
                type="text"
                placeholder="Buscar organizações de saúde..." 
                className="medical-input"
              />
            </div>
            <Link href="/create-organization">
              <button className="btn-medical-secondary">
                <Building2 className="w-4 h-4 mr-2" />
                Nova organização
              </button>
            </Link>
          </div>

          {/* Organizations Grid Médico */}
          <div className="grid gap-4">
            {organizations.map((organization, index) => (
              <Link 
                key={organization.id} 
                href={`org/${organization.slug}`}
                className="group"
              >
                <div className={`medical-card p-6 hover:shadow-lg transition-all duration-300 medical-fade-in ${
                  organization.slug === currentOrg ? 'border-l-4 border-l-blue-500' : ''
                }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Médico */}
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-colors">
                        {organization.avatarUrl && (
                          <AvatarImage src={organization.avatarUrl} />
                        )}
                        {organization.name && (
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                            {getInitials(organization.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {organization.slug === currentOrg && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
                          <Flag className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content Médico */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                            {organization.name}
                          </h3>
                          
                          {/* Organization details */}
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" />
                              <span>Organização de Saúde</span>
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-2">
                            {organization.slug === currentOrg && (
                              <span className="status-indicator status-progress">
                                <Flag className="w-3 h-3" />
                                Organização Atual
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer info Médico */}
          <div className="medical-card p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-600">
                {organizations.length} {organizations.length === 1 ? 'organização' : 'organizações'} de saúde
              </p>
              {currentOrganization && (
                <p className="text-slate-600">
                  Organização atual: <span className="font-medium text-slate-800">{currentOrganization.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}