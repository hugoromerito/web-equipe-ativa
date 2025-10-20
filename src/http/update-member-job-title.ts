import { api } from './api-client'

export interface UpdateMemberJobTitleRequest {
  jobTitleId: string
}

export async function updateMemberJobTitle(
  organizationSlug: string,
  memberId: string,
  jobTitleId: string
) {
  await api.patch(
    `organizations/${organizationSlug}/members/${memberId}/job-title`,
    {
      json: {
        jobTitleId,
      },
    }
  )
}
