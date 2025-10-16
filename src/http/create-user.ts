import { api } from './api-client'

export interface CreateUserRequest {
  organizationSlug: string
  name: string
  email: string
  password: string
  role: string
  unitSlug?: string
}

interface CreateUserResponse {
  userId: string
}

export async function createUser({
  organizationSlug,
  name,
  email,
  password,
  role,
  unitSlug,
}: CreateUserRequest) {
  const result = await api
    .post(`organizations/${organizationSlug}/users`, {
      json: {
        name,
        email,
        password,
        role,
        unitSlug,
      },
    })
    .json<CreateUserResponse>()

  return result
}
