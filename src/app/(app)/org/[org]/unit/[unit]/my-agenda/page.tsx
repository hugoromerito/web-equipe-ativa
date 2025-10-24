import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { getMyDemands } from '@/http/get-my-demands'
import { MyAgenda } from './my-agenda-list'

export default async function MyAgendaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  // Extrair e validar search params
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 20
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined
  const priority = typeof searchParams.priority === 'string' ? searchParams.priority : undefined
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const sort_by = typeof searchParams.sort_by === 'string' ? searchParams.sort_by : undefined
  const sort_order = typeof searchParams.sort_order === 'string' 
    ? (searchParams.sort_order as 'asc' | 'desc') 
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
