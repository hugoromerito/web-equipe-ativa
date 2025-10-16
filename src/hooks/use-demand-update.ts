import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDemand, type UpdateDemandRequest } from '@/http'

export function useUpdateDemand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateDemandRequest) => updateDemand(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['demands', variables.organizationSlug, variables.unitSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['demand', variables.demandId],
      })
    },
  })
}
