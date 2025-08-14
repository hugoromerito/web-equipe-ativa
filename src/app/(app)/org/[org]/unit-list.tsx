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
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building className="size-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Unidades
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Selecione uma unidade para acessar ou crie uma nova
        </p>
      </div>

      {!units || units.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
            <Building className="size-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma unidade encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            Esta organização ainda não possui unidades. Crie a primeira unidade para começar.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Building className="size-4 mr-2" />
            Criar primeira unidade
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                placeholder="Buscar unidades..." 
                className="pl-10 h-10"
              />
            </div>
            <Link href={`/org/${currentOrg}/create-unit`}>
            <Button variant="outline" className="shrink-0 cursor-pointer">
              <Building className="size-4 mr-2" />
              Nova unidade
            </Button>
            </Link>
          </div>

          {/* Units Grid/List */}
          <div className="grid gap-3 md:gap-4">
            {units.map((unit) => (
              <Link 
                key={unit.id} 
                href={`/org/${currentOrg}/unit/${unit.slug}`}
                className="group"
              >
                <div className="relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50">
                  {/* Avatar/Icon */}
                  <div className="relative">
                    <div className="flex items-center justify-center size-12 bg-blue-100 dark:bg-blue-900 rounded-lg ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-colors">
                      <Building className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    {unit.slug === currentUnitSlug && (
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
                          {unit.name}
                        </h3>
                        
                        {/* Unit details */}
                        <div className="space-y-1 mt-2">
                          {unit.description && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Flag className="size-3 flex-shrink-0" />
                              <span className="truncate">{unit.description}</span>
                            </div>
                          )}
                          
                          {unit.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="size-3 flex-shrink-0" />
                              <span className="truncate">{unit.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Unit status */}
                        <div className="flex items-center gap-2 mt-3">
                          {unit.slug === currentUnitSlug && (
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
              {units.length} {units.length === 1 ? 'unidade' : 'unidades'}
            </p>
            {currentUnit && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unidade atual: <span className="font-medium text-gray-700 dark:text-gray-300">{currentUnit.name}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}