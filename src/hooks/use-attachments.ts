import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAttachments,
  type GetAttachmentsRequest,
  uploadUserAvatar,
  uploadApplicantAvatar,
  type UploadApplicantAvatarRequest,
  uploadOrganizationAvatar,
  type UploadOrganizationAvatarRequest,
  uploadApplicantDocument,
  type UploadApplicantDocumentRequest,
  uploadDemandDocument,
  type UploadDemandDocumentRequest,
  uploadOrganizationDocument,
  type UploadOrganizationDocumentRequest,
  deleteAttachment,
  type DeleteAttachmentRequest,
} from '@/http'

export function useAttachments(
  params: Omit<GetAttachmentsRequest, 'page' | 'limit'> & {
    page?: number
    limit?: number
  }
) {
  return useQuery({
    queryKey: ['attachments', params.organizationSlug, params],
    queryFn: () =>
      getAttachments({ ...params, page: params.page ?? 1, limit: params.limit ?? 20 }),
    enabled: !!params.organizationSlug,
  })
}

export function useUploadUserAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string; file: File }) => uploadUserAvatar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUploadApplicantAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadApplicantAvatarRequest) =>
      uploadApplicantAvatar(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['applicant', variables.applicantId],
      })
      queryClient.invalidateQueries({
        queryKey: ['attachments', variables.organizationSlug],
      })
    },
  })
}

export function useUploadOrganizationAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadOrganizationAvatarRequest) =>
      uploadOrganizationAvatar(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['organization', variables.organizationSlug],
      })
    },
  })
}

export function useUploadApplicantDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadApplicantDocumentRequest) =>
      uploadApplicantDocument(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachments', variables.organizationSlug],
      })
    },
  })
}

export function useUploadDemandDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadDemandDocumentRequest) =>
      uploadDemandDocument(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachments', variables.organizationSlug],
      })
    },
  })
}

export function useUploadOrganizationDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadOrganizationDocumentRequest) =>
      uploadOrganizationDocument(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachments', variables.organizationSlug],
      })
    },
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteAttachmentRequest) => deleteAttachment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachments', variables.organizationSlug],
      })
    },
  })
}
