import { z } from 'zod'

/*
  Setores de Atendimento
  ownerId - Identificador único do dono do setor
*/
export const applicantSchema = z.object({
  __typename: z.literal('Applicant').default('Applicant'),
  id: z.string(),
  ownerId: z.string(),
})

export type Applicant = z.infer<typeof applicantSchema>
