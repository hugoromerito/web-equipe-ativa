import { api } from './api-client'
import { convertDaysToApi } from '@/constants/week-days'

export interface AssignJobTitleRequest {
  jobTitleId: string
  workDays?: string[] // Array de dias da semana: ['monday', 'tuesday', ...]
}

export async function assignJobTitleToMember(
  organizationSlug: string,
  memberId: string,
  data: AssignJobTitleRequest
) {
  try {
    // Primeiro, atualiza o cargo
    await api.patch(
      `organizations/${organizationSlug}/members/${memberId}/job-title`,
      {
        json: {
          jobTitleId: data.jobTitleId,
        },
      }
    )
    
    // Depois, atualiza os dias de trabalho (se fornecidos)
    if (data.workDays && data.workDays.length > 0) {
      // Converte os dias para o formato da API (português maiúsculas)
      const convertedDays = convertDaysToApi(data.workDays)
      
      await api.patch(
        `organizations/${organizationSlug}/members/${memberId}/working-days`,
        {
          json: {
            workingDays: convertedDays,
          },
        }
      )
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('❌ Error assigning job title:', {
      organizationSlug,
      memberId,
      data,
      error: error.message,
      status: error.response?.status,
      body: await error.response?.text?.().catch(() => 'Unable to read body')
    })
    throw error
  }
}
