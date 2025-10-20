import { api } from './api-client'

export interface CreateJobTitleRequest {
  name: string
  description?: string
}

export interface CreateJobTitleResponse {
  jobTitleId: string
}

export async function createJobTitle(
  organizationSlug: string,
  data: CreateJobTitleRequest
) {
  const result = await api
    .post(`organizations/${organizationSlug}/job-titles`, {
      json: data,
    })
    .json<CreateJobTitleResponse>()

  return result
}
