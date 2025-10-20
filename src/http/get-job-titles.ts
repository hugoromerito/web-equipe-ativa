import { api } from './api-client'

export interface JobTitle {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface GetJobTitlesResponse {
  jobTitles: JobTitle[]
}

export async function getJobTitles(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/job-titles`)
    .json<GetJobTitlesResponse>()

  return result
}
