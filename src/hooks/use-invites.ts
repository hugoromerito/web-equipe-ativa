import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getInvites,
  getOrganizationInvites,
  type GetOrganizationInvitesRequest,
  createInvite,
  type CreateInviteRequest,
  acceptInvite,
  rejectInvite,
} from '@/http'

export function useInvites() {
  return useQuery({
    queryKey: ['invites', 'pending'],
    queryFn: () => getInvites(),
  })
}

// Alias para compatibilidade
export function usePendingInvites() {
  return useInvites()
}

export function useOrganizationInvites(params: GetOrganizationInvitesRequest) {
  return useQuery({
    queryKey: ['invites', 'organization', params.organizationSlug],
    queryFn: () => getOrganizationInvites(params),
    enabled: !!params.organizationSlug,
  })
}

export function useCreateInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInviteRequest) => createInvite(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['invites', 'organization', variables.organizationSlug],
      })
    },
  })
}

export function useAcceptInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['membership'] })
    },
  })
}

export function useRejectInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => rejectInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    },
  })
}
