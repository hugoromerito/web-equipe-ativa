import { api } from './api-client'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  password?: string
  currentPassword?: string
}

export async function updateProfile({
  name,
  email,
  password,
  currentPassword,
}: UpdateProfileRequest) {
  await api
    .patch('profile', {
      json: {
        name,
        email,
        password,
        currentPassword,
      },
    })
    .json()
}
