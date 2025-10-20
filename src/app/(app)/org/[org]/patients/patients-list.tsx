'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, Users, Phone, Calendar, FileText, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePatients } from '@/hooks/use-patients'

interface PatientsListProps {
  organizationSlug: string
}

export function PatientsList({ organizationSlug }: PatientsListProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: patientsData, isLoading } = usePatients({
    organizationSlug,
    page,
    pageSize,
    search: search || undefined,
  })

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return '-'
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone: string | null) => {
    if (!phone) return '-'
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return '-'
    try {
      const birth = new Date(birthDate)
      const today = new Date()
      const age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return `${age - 1} anos`
      }
      return `${age} anos`
    } catch {
      return '-'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Pacientes
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os pacientes cadastrados na organização
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="medical-stat-badge">
            <Users className="h-4 w-4 mr-1" />
            {patientsData?.pagination.total || 0} pacientes
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Pacientes
          </CardTitle>
          <CardDescription>
            Digite o nome, CPF ou email do paciente para buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button 
              onClick={() => setPage(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-900">Nome</TableHead>
                      <TableHead className="font-semibold text-slate-900">CPF</TableHead>
                      <TableHead className="font-semibold text-slate-900">Idade</TableHead>
                      <TableHead className="font-semibold text-slate-900">Responsáveis</TableHead>
                      <TableHead className="font-semibold text-slate-900">Observações</TableHead>
                      <TableHead className="font-semibold text-slate-900">Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsData?.applicants.map((patient) => (
                      <TableRow 
                        key={patient.id}
                        className="hover:bg-blue-25 hover:bg-blue-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {patient.name}
                            </span>
                            {patient.ticket && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Ticket: {patient.ticket}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="font-mono text-sm">
                            {formatCPF(patient.cpf)}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {calculateAge(patient.birthdate)}
                            </span>
                            {patient.birthdate && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(patient.birthdate)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {patient.phone && (
                              <span className="text-sm flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {formatPhone(patient.phone)}
                              </span>
                            )}
                            {patient.mother && (
                              <span className="text-sm text-muted-foreground">
                                Mãe: {patient.mother}
                              </span>
                            )}
                            {patient.father && (
                              <span className="text-sm text-muted-foreground">
                                Pai: {patient.father}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {patient.observation ? (
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {patient.observation}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(patient.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}

                    {patientsData?.applicants.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {search 
                                ? 'Nenhum paciente encontrado com os critérios de busca'
                                : 'Nenhum paciente cadastrado'
                              }
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {patientsData && patientsData.pagination.total > pageSize && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {page} de {patientsData.pagination.total_pages} 
                    ({patientsData.pagination.total} pacientes)
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!patientsData.pagination.has_prev}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!patientsData.pagination.has_next}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
