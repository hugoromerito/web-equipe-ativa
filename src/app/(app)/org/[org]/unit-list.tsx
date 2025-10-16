import { Flag, MapPin, Building, ArrowRight, Search } from 'lucide-react'

import { getCurrentOrg, getCurrentUnit, getCurrentUnits } from '@/lib/auth'
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

export async function UnitList() {
  const currentOrg = await getCurrentOrg()
  const currentUnitSlug = await getCurrentUnit()

  const units = await getCurrentUnits()

  const currentUnit = units?.find((unit) => unit.slug === currentUnitSlug)

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
          Unidades Médicas
        </h1>
        <p className="medical-section-subtitle">
          Acesse as unidades de saúde da organização ou crie uma nova unidade
        </p>
      </div>

      {!units || units.length === 0 ? (
        /* Empty State Médico */
        <div className="medical-card p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Nenhuma unidade encontrada
          </h3>
          <p className="text-slate-600 mb-6">
            Esta organização ainda não possui unidades médicas. Crie a primeira unidade para começar.
          </p>
          <Link href={`/org/${currentOrg}/create-unit`}>
            <button className="btn-medical">
              <Building className="w-4 h-4 mr-2" />
              Criar primeira unidade
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
                placeholder="Buscar unidades médicas..." 
                className="medical-input"
              />
            </div>
            <Link href={`/org/${currentOrg}/create-unit`}>
              <button className="btn-medical-secondary">
                <Building className="w-4 h-4 mr-2" />
                Nova unidade
              </button>
            </Link>
          </div>

          {/* Units Grid Médico */}
          <div className="grid gap-4">
            {units.map((unit, index) => (
              <Link 
                key={unit.id} 
                href={`/org/${currentOrg}/unit/${unit.slug}`}
                className="group"
              >
                <div className={`medical-card p-6 hover:shadow-lg transition-all duration-300 medical-fade-in ${
                  unit.slug === currentUnitSlug ? 'border-l-4 border-l-blue-500' : ''
                }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Médico */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-blue-200 transition-colors">
                        <Building className="w-7 h-7 text-blue-600" />
                      </div>
                      {unit.slug === currentUnitSlug && (
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
                            {unit.name}
                          </h3>
                          
                          {/* Unit details */}
                          <div className="space-y-1.5 mb-3">
                            {unit.description && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Flag className="w-4 h-4 flex-shrink-0 text-blue-500" />
                                <span className="truncate">{unit.description}</span>
                              </div>
                            )}
                            
                            {unit.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />
                                <span className="truncate">{unit.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-2">
                            {unit.slug === currentUnitSlug && (
                              <span className="status-indicator status-progress">
                                <Flag className="w-3 h-3" />
                                Unidade Atual
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
                {units.length} {units.length === 1 ? 'unidade' : 'unidades'} médica{units.length === 1 ? '' : 's'}
              </p>
              {currentUnit && (
                <p className="text-slate-600">
                  Unidade atual: <span className="font-medium text-slate-800">{currentUnit.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}