import { ability } from '@/lib/auth'
import { DemandList } from './demand-list'
import { Header } from '@/components/header'
import { getDemands } from '@/http/get-demands'

interface PageProps {
  params: {
    org: string
    unit: string
  }
  searchParams: {
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
  }
}

// Tipo para as demandas
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
}

export default async function DemandsPage({ params, searchParams }: PageProps) {
  const permissions = await ability()
  const currentOrg = params.org
  const currentUnit = params.unit

  // Processar os parâmetros de busca
  const processedParams = {
    organizationSlug: currentOrg,
    unitSlug: currentUnit,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    category: searchParams.category || undefined,
    status: searchParams.status || undefined, 
    priority: searchParams.priority || undefined,
    search: searchParams.search || undefined,
    sort_by: searchParams.sort_by || 'created_at',
    sort_order: searchParams.sort_order || 'desc',
    created_at: searchParams.created_at ? new Date(searchParams.created_at) : undefined,
    updated_at: searchParams.updated_at ? new Date(searchParams.updated_at) : undefined,
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

    demands = response.demands.map((demand: any) => ({
      id: demand.id,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      category: demand.category,
      createdAt: demand.created_at,
      author: demand.author || demand.created_by_member_name,
      location: [
        demand.street,
        demand.number,
        demand.neighborhood,
        demand.city,
        demand.state,
      ]
        .filter(Boolean)
        .join(', ') || 'Localização não informada',
      urgency: calculateUrgency(demand),
    }))

    pagination = response.pagination

  } catch (error) {
    console.error('❌ Erro ao carregar demandas:', error)
    
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
          initialSearchParams={searchParams}
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