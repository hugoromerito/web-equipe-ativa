import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  type GetUsersRequest,
  createUser,
  type CreateUserRequest,
} from '@/http'

export function useUsers(params: Omit<GetUsersRequest, 'page' | 'limit'> & { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['users', params.organizationSlug, params],
    queryFn: () => getUsers({ ...params, page: params.page ?? 1, limit: params.limit ?? 20 }),
    enabled: !!params.organizationSlug,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users', variables.organizationSlug],
      })
    },
  })
}
