import { api } from './api-client'

export async function deleteJobTitle(
  organizationSlug: string,
  jobTitleId: string
) {
  await api.delete(`organizations/${organizationSlug}/job-titles/${jobTitleId}`)
}
