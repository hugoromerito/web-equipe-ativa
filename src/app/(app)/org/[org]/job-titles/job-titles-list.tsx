'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Briefcase, Loader2, Pencil, Trash2, MoreVertical, FileText } from 'lucide-react'

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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useJobTitles } from '@/hooks/use-job-titles'
import { CreateJobTitleDialog } from '@/components/create-job-title-dialog'
import { EditJobTitleDialog } from '@/components/edit-job-title-dialog'
import { toast } from 'sonner'
import type { JobTitle } from '@/http/get-job-titles'

interface JobTitlesListProps {
  organizationSlug: string
}

export function JobTitlesList({ organizationSlug }: JobTitlesListProps) {
  const { jobTitles, isLoading, deleteJobTitle, isDeleting } = useJobTitles(organizationSlug)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobTitleToDelete, setJobTitleToDelete] = useState<JobTitle | null>(null)

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  const handleDeleteClick = (jobTitle: JobTitle) => {
    setJobTitleToDelete(jobTitle)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!jobTitleToDelete) return

    try {
      await deleteJobTitle(jobTitleToDelete.id)
      toast.success('Cargo deletado com sucesso!')
      setDeleteDialogOpen(false)
      setJobTitleToDelete(null)
    } catch (error) {
      toast.error('Erro ao deletar cargo. Verifique se não há membros associados.')
      console.error(error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cargos e Funções
            </h1>
            <p className="text-muted-foreground">
              Gerencie os cargos e funções da sua organização
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="medical-stat-badge">
              <Briefcase className="h-4 w-4 mr-1" />
              {jobTitles.length} {jobTitles.length === 1 ? 'cargo' : 'cargos'}
            </Badge>
            <CreateJobTitleDialog organizationSlug={organizationSlug} />
          </div>
        </div>

        {/* Job Titles Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Lista de Cargos</CardTitle>
            <CardDescription>
              Todos os cargos cadastrados na organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-900">Cargo</TableHead>
                      <TableHead className="font-semibold text-slate-900">Descrição</TableHead>
                      <TableHead className="font-semibold text-slate-900">Criado em</TableHead>
                      <TableHead className="font-semibold text-slate-900 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobTitles.map((jobTitle) => (
                      <TableRow 
                        key={jobTitle.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-slate-900">
                              {jobTitle.name}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {jobTitle.description ? (
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {jobTitle.description}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              Sem descrição
                            </span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(jobTitle.createdAt)}
                          </span>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <EditJobTitleDialog
                                organizationSlug={organizationSlug}
                                jobTitle={jobTitle}
                              >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              </EditJobTitleDialog>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => handleDeleteClick(jobTitle)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {jobTitles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              Nenhum cargo cadastrado
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Clique em "Novo Cargo" para adicionar o primeiro cargo
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cargo "{jobTitleToDelete?.name}" será 
              permanentemente deletado.
              {jobTitleToDelete?.description && (
                <span className="block mt-2 text-sm">
                  <strong>Descrição:</strong> {jobTitleToDelete.description}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                'Deletar Cargo'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
