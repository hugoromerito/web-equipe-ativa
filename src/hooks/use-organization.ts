import { useQuery } from '@tanstack/react-query'
import { getOrganization } from '@/http/get-organization'

export function useOrganization(slug: string | undefined) {
  return useQuery({
    queryKey: ['organization', slug],
    queryFn: () => {
      if (!slug) throw new Error('Organization slug is required')
      return getOrganization(slug)
    },
    enabled: !!slug && slug.length > 0, // Mais rigoroso
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (antes era cacheTime)
    refetchOnWindowFocus: false, // Não refetch ao focar a janela
    refetchOnMount: false, // Não refetch ao montar se dados estão fresh
    refetchOnReconnect: false, // Não refetch ao reconectar
    retry: false, // Não fazer retry automático
  })
}
