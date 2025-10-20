import { api } from './api-client'

export interface UpdateJobTitleRequest {
  name?: string
  description?: string
}

export async function updateJobTitle(
  organizationSlug: string,
  jobTitleId: string,
  data: UpdateJobTitleRequest
) {
  await api.patch(`organizations/${organizationSlug}/job-titles/${jobTitleId}`, {
    json: data,
  })
}
