'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Briefcase, Calendar, Loader2, UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WeekDaysSelector } from '@/components/week-days-selector'
import { useJobTitles } from '@/hooks/use-job-titles'
import { assignJobTitleToMember } from '@/http/assign-job-title'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AssignJobTitleFormProps {
  organizationSlug: string
  memberId: string
  memberData: {
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export function AssignJobTitleForm({
  organizationSlug,
  memberId,
  memberData,
}: AssignJobTitleFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(organizationSlug)

  const assignMutation = useMutation({
    mutationFn: async () => {
      await assignJobTitleToMember(organizationSlug, memberId, {
        jobTitleId: selectedJobTitle,
        workDays: selectedDays,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['members', organizationSlug],
      })
      toast.success('Cargo atribuído com sucesso!')
      router.push(`/org/${organizationSlug}/members`)
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      
      // Mensagens específicas baseadas no erro
      if (error.response?.status === 404) {
        toast.error('⚠️ Endpoint não encontrado. A API ainda não foi implementada.')
      } else if (error.response?.status === 401) {
        toast.error('🔒 Não autorizado. Faça login novamente.')
      } else if (error.response?.status === 400) {
        toast.error('❌ Dados inválidos. Verifique os campos.')
      } else if (error.response?.status === 500) {
        toast.error('🔧 Erro no servidor. Contate o suporte.')
      } else {
        toast.error(`Erro ao atribuir cargo: ${error.message || 'Tente novamente.'}`)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedJobTitle) {
      toast.error('Selecione um cargo')
      return
    }

    if (selectedDays.length === 0) {
      toast.error('Selecione pelo menos um dia de trabalho')
      return
    }

    assignMutation.mutate()
  }

  const selectedJobTitleData = jobTitles.find((job) => job.id === selectedJobTitle)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Atribuir Cargo ao Membro
        </h1>
        <p className="text-muted-foreground">
          Defina o cargo e os dias de trabalho para o membro selecionado
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Member Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Informações do Membro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={memberData.avatarUrl || ''} />
                <AvatarFallback className="text-2xl">
                  {memberData.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">
                  {memberData.name || 'Sem nome'}
                </h3>
                <p className="text-sm text-muted-foreground">{memberData.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Atribuição de Cargo
            </CardTitle>
            <CardDescription>
              Selecione o cargo e os dias de trabalho deste membro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title Selection */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  Cargo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedJobTitle}
                  onValueChange={setSelectedJobTitle}
                  disabled={isLoadingJobTitles || assignMutation.isPending}
                >
                  <SelectTrigger id="jobTitle" className="w-full">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((jobTitle) => (
                      <SelectItem key={jobTitle.id} value={jobTitle.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{jobTitle.name}</span>
                          {jobTitle.description && (
                            <span className="text-xs text-muted-foreground">
                              {jobTitle.description.substring(0, 50)}
                              {jobTitle.description.length > 50 ? '...' : ''}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Job Title Info */}
                {selectedJobTitleData && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {selectedJobTitleData.name}
                    </p>
                    {selectedJobTitleData.description && (
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {selectedJobTitleData.description}
                      </p>
                    )}
                  </div>
                )}

                {jobTitles.length === 0 && !isLoadingJobTitles && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Nenhum cargo cadastrado. Crie cargos primeiro em{' '}
                      <a
                        href={`/org/${organizationSlug}/job-titles`}
                        className="underline font-medium"
                      >
                        Gerenciar Cargos
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Work Days Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dias de Trabalho <span className="text-red-500">*</span>
                </Label>
                <WeekDaysSelector
                  selectedDays={selectedDays}
                  onDaysChange={setSelectedDays}
                  disabled={assignMutation.isPending}
                  variant="default"
                  showCard={false}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={assignMutation.isPending}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    assignMutation.isPending ||
                    !selectedJobTitle ||
                    selectedDays.length === 0 ||
                    jobTitles.length === 0
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {assignMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Atribuindo...
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Atribuir Cargo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
