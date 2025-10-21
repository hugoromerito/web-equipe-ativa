import { ability } from '@/lib/auth'
import { DemandList } from './demand-list'
import { Header } from '@/components/header'
import { getDemands } from '@/http/get-demands'

interface PageProps {
  params: Promise<{
    org: string
    unit: string
  }>
  searchParams: Promise<{
    page?: string
    limit?: string
    category?: string
    status?: string
    priority?: string
    created_at?: string
    updated_at?: string
    search?: string
    sort_by?: 'created_at' | 'updated_at' | 'priority' | 'status'
    sort_order?: 'asc' | 'desc'
  }>
}

// Tipo para as consultas
interface Demand {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: string
  author: string
  location: string
  urgency: number
  scheduledDate: string | null
  scheduledTime: string | null
  responsible: {
    id: string
    name: string
    email: string
    jobTitle: string
  } | null
}

export default async function DemandsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const permissions = await ability()
  
  // Extrair valores dos parâmetros
  const { org: currentOrg, unit: currentUnit } = resolvedParams
  const search = resolvedSearchParams

  // Processar os parâmetros de busca
  const processedParams = {
    organizationSlug: currentOrg,
    unitSlug: currentUnit,
    page: search.page ? parseInt(search.page) : 1,
    limit: search.limit ? parseInt(search.limit) : 20,
    category: search.category || undefined,
    status: search.status || undefined, 
    priority: search.priority || undefined,
    search: search.search || undefined,
    // ✅ Não enviar sort_by e sort_order se não estiverem na URL
    // Deixar a API usar sua ordenação padrão
    sort_by: search.sort_by || undefined,
    sort_order: search.sort_order || undefined,
    created_at: search.created_at ? new Date(search.created_at) : undefined,
    updated_at: search.updated_at ? new Date(search.updated_at) : undefined,
  }

  let demands: Demand[] = []
  let pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  }

  try {    
    const response = await getDemands(processedParams)

    // 🐛 DEBUG: Log para verificar ordenação
    console.log('🔍 DEBUG - Ordenação recebida do servidor:', {
      sort_by: processedParams.sort_by,
      sort_order: processedParams.sort_order,
      total_demands: response.demands.length,
      first_3_created_at: response.demands.slice(0, 3).map(d => ({
        id: d.id.substring(0, 8),
        title: d.title.substring(0, 30),
        created_at: d.created_at,
      })),
    })

    demands = response.demands.map((demand: any) => ({
      id: demand.id,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      category: demand.category,
      createdAt: demand.created_at,
      author: demand.author || demand.created_by_member_name,
      location: demand.applicant_name || 'Paciente não identificado',
      urgency: calculateUrgency(demand),
      scheduledDate: demand.scheduled_date,
      scheduledTime: demand.scheduled_time,
      responsible: demand.responsible ? {
        id: demand.responsible.id,
        name: demand.responsible.name,
        email: demand.responsible.email,
        jobTitle: demand.responsible.job_title,
      } : null,
    }))

    pagination = response.pagination

  } catch (error) {
    console.error('❌ Erro ao carregar consultas:', error)
    
    // Em caso de erro, ainda renderizamos a página com array vazio
    // para não quebrar a interface
    demands = []
  }

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        <DemandList
          currentOrg={currentOrg}
          currentUnit={currentUnit}
          demands={demands}
          pagination={pagination}
          initialSearchParams={resolvedSearchParams}
        />
      </div>
    </>
  )
}

// Função auxiliar para calcular urgência
function calculateUrgency(demand: any): number {
  let urgency = 50

  // Aumentar urgência baseado na prioridade
  switch (demand.priority) {
    case 'URGENT':
      urgency += 40
      break
    case 'HIGH':
      urgency += 25
      break
    case 'MEDIUM':
      urgency += 10
      break
    default:
      // LOW ou outros valores não afetam a urgência base
      break
  }

  // Aumentar urgência baseado no tempo desde criação
  const createdAt = demand.created_at || demand.createdAt
  if (createdAt) {
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysSinceCreated > 30) {
      urgency += 20
    } else if (daysSinceCreated > 7) {
      urgency += 10
    }
  }

  // Aumentar urgência baseado no status
  switch (demand.status) {
    case 'PENDING':
      urgency += 15
      break
    case 'IN_PROGRESS':
      urgency += 5
      break
    case 'RESOLVED':
      urgency = Math.max(urgency - 30, 10) // Reduzir urgência para resolvidas
      break
  }

  return Math.min(Math.max(urgency, 0), 100) // Garantir que está entre 0 e 100
}