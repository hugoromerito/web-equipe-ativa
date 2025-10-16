import { api } from './api-client'

export interface RequestPasswordRecoverRequest {
  email: string
}

export async function requestPasswordRecover({
  email,
}: RequestPasswordRecoverRequest) {
  await api.post('password/recover', {
    json: {
      email,
    },
  })
}
