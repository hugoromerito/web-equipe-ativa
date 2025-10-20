import { api } from './api-client'

export interface JobTitle {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface GetJobTitleResponse {
  jobTitle: JobTitle
}

export async function getJobTitle(organizationSlug: string, jobTitleId: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/job-titles/${jobTitleId}`)
    .json<GetJobTitleResponse>()

  return result
}
