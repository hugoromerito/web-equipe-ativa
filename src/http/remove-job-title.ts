import { api } from './api-client'

export async function removeJobTitleFromMember(
  organizationSlug: string,
  memberId: string
) {
  // Remove o cargo definindo como null
  await api.patch(
    `organizations/${organizationSlug}/members/${memberId}/job-title`,
    {
      json: {
        jobTitleId: null,
      },
    }
  )
}
