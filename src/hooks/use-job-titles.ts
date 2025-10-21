import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { 
  getJobTitles, 
  type JobTitle 
} from '@/http/get-job-titles'
import { 
  createJobTitle, 
  type CreateJobTitleRequest 
} from '@/http/create-job-title'
import { 
  updateJobTitle, 
  type UpdateJobTitleRequest 
} from '@/http/update-job-title'
import { deleteJobTitle } from '@/http/delete-job-title'

// Dados mockados para visualização
function generateMockJobTitles(): { jobTitles: JobTitle[] } {
  return {
    jobTitles: [
      {
        id: 'job-1',
        name: 'Médico',
        description: 'Profissional de medicina geral',
        organizationId: 'org-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'job-2',
        name: 'Psicólogo',
        description: 'Profissional de psicologia clínica',
        organizationId: 'org-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'job-3',
        name: 'Enfermeiro',
        description: 'Profissional de enfermagem',
        organizationId: 'org-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'job-4',
        name: 'Fisioterapeuta',
        description: 'Profissional de fisioterapia',
        organizationId: 'org-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }
}

export function useJobTitles(organizationSlug: string) {
  const queryClient = useQueryClient()

  // Verificar se o token está disponível antes de fazer a requisição
  const hasToken = typeof window !== 'undefined' && !!getCookie('token')

  // ✅ PRODUÇÃO: Usando API real
  const { data, isLoading, error } = useQuery({
    queryKey: ['job-titles', organizationSlug],
    queryFn: () => getJobTitles(organizationSlug),
    enabled: !!organizationSlug && hasToken,
  })

  // DESENVOLVIMENTO: Descomentar para usar dados mockados
  /*
  const { data, isLoading, error } = useQuery({
    queryKey: ['job-titles', organizationSlug],
    queryFn: async () => {
      console.warn('⚠️ Usando dados mockados - Endpoint /job-titles com problemas no backend')
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300))
      return generateMockJobTitles()
    },
    enabled: !!organizationSlug,
  })
  */

  const createMutation = useMutation({
    mutationFn: (data: CreateJobTitleRequest) =>
      createJobTitle(organizationSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['job-titles', organizationSlug] 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ 
      jobTitleId, 
      data 
    }: { 
      jobTitleId: string
      data: UpdateJobTitleRequest 
    }) =>
      updateJobTitle(organizationSlug, jobTitleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['job-titles', organizationSlug] 
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (jobTitleId: string) =>
      deleteJobTitle(organizationSlug, jobTitleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['job-titles', organizationSlug] 
      })
    },
  })

  return {
    jobTitles: data?.jobTitles ?? [],
    isLoading,
    error,
    createJobTitle: createMutation.mutateAsync,
    updateJobTitle: updateMutation.mutateAsync,
    deleteJobTitle: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

