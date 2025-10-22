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

  const currentUnit = units?.find((unit: any) => unit.slug === currentUnitSlug)

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
      {/* Header Section Médico */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Building className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Unidades Médicas
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Gerencie as unidades de saúde da sua organização. Cada unidade representa um departamento 
          ou área específica da instituição médica.
        </p>
      </div>

      {!units || units.length === 0 ? (
        /* Empty State Médico Melhorado */
        <div className="medical-card medical-fade-in p-16 text-center max-w-xl mx-auto mt-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 medical-hover-lift">
            <Building className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Nenhuma unidade encontrada
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Esta organização ainda não possui unidades médicas configuradas. 
              <br />
              <span className="font-medium">Crie a primeira unidade para começar a organizar sua equipe.</span>
            </p>
          </div>

          <div className="space-y-4">
            <Link href={`/org/${currentOrg}/create-unit`}>
              <Button className="btn-medical-primary inline-flex items-center px-8 py-3 text-base font-semibold hover:shadow-lg transition-all">
                <Building className="w-5 h-5 mr-3" />
                Criar primeira unidade
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Configuração rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Organização profissional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Gestão centralizada</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-dashed border-border">
            <h3 className="font-semibold text-foreground mb-2">💡 Dica</h3>
            <p className="text-sm text-muted-foreground">
              Unidades ajudam a organizar diferentes escritórios regionais como 
              <span className="font-medium"> Matriz, Filiais, Laboratório</span> e mais.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and Actions Médicos */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                type="text"
                placeholder="Buscar unidades médicas..." 
                className="medical-form-input pl-12 h-12 text-base"
              />
            </div> */}
            <Link href={`/org/${currentOrg}/create-unit`}>
              <Button className="btn-medical-primary inline-flex items-center px-6 py-3 h-12 text-base font-semibold">
                <Building className="w-5 h-5 mr-2" />
                Nova unidade
              </Button>
            </Link>
          </div>

          {/* Units Grid Médico */}
          <div className="grid gap-4">
            {units.map((unit: any, index: number) => (
              <Link 
                key={unit.id} 
                href={`/org/${currentOrg}/unit/${unit.slug}`}
                className="group block"
              >
                <div className={`medical-card-interactive p-6 ${
                  unit.slug === currentUnitSlug 
                    ? 'border-l-4 border-l-primary bg-primary/5' 
                    : ''
                } animate-slide-in-up medical-hover-lift`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    {/* Icon Médico */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300 group-hover:scale-105">
                        <Building className="w-8 h-8 text-primary" />
                      </div>
                      {unit.slug === currentUnitSlug && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                          <Flag className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content Médico */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {unit.name}
                          </h3>
                          
                          {/* Unit details */}
                          <div className="space-y-2">
                            {unit.description && (
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Flag className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span>{unit.description}</span>
                              </div>
                            )}
                            
                            {unit.location && (
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span>{unit.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-2">
                            {unit.slug === currentUnitSlug && (
                              <Badge className="badge-medical-success">
                                <Flag className="w-3 h-3 mr-1" />
                                Unidade Atual
                              </Badge>
                            )}
                            <Badge className="badge-medical-info">
                              <Building className="w-3 h-3 mr-1" />
                              Unidade Médica
                            </Badge>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer info Médico */}
          <div className="medical-card p-6 bg-muted/20 border-dashed">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <p className="text-muted-foreground font-medium">
                  {units.length} {units.length === 1 ? 'unidade médica' : 'unidades médicas'} cadastrada{units.length === 1 ? '' : 's'}
                </p>
              </div>
              {currentUnit && (
                <div className="flex items-center gap-2">
                  <Badge className="badge-medical-primary">
                    <Building className="w-3 h-3 mr-1" />
                    Unidade atual: {currentUnit.name}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}