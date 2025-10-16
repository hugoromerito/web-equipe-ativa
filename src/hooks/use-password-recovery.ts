import { useMutation } from '@tanstack/react-query'
import {
  requestPasswordRecover,
  type RequestPasswordRecoverRequest,
  resetPassword,
  type ResetPasswordRequest,
} from '@/http'

export function useRequestPasswordRecover() {
  return useMutation({
    mutationFn: (data: RequestPasswordRecoverRequest) =>
      requestPasswordRecover(data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  })
}
