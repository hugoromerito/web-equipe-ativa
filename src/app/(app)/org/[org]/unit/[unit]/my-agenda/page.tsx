import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { getMyDemands } from '@/http/get-my-demands'
import { MyAgenda } from './my-agenda-list'

export default async function MyAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  
  // Await searchParams (Next.js 15)
  const resolvedSearchParams = await searchParams

  // Extrair e validar search params
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1
  const limit = typeof resolvedSearchParams.limit === 'string' ? parseInt(resolvedSearchParams.limit) : 20
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined
  const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined
  const priority = typeof resolvedSearchParams.priority === 'string' ? resolvedSearchParams.priority : undefined
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined
  const sort_by = typeof resolvedSearchParams.sort_by === 'string' ? resolvedSearchParams.sort_by : undefined
  const sort_order = typeof resolvedSearchParams.sort_order === 'string' 
    ? (resolvedSearchParams.sort_order as 'asc' | 'desc') 
    : undefined

  // Buscar as demandas do profissional logado
  const { demands, pagination } = await getMyDemands({
    organizationSlug: currentOrg!,
    unitSlug: currentUnit!,
    page,
    limit,
    category,
    status,
    priority,
    search,
    sort_by,
    sort_order,
  })

  return (
    <MyAgenda
      currentOrg={currentOrg!}
      currentUnit={currentUnit!}
      demands={demands}
      pagination={pagination}
      initialSearchParams={{
        page: page.toString(),
        limit: limit.toString(),
        category,
        status,
        priority,
        search,
        sort_by,
        sort_order,
      }}
    />
  )
}
