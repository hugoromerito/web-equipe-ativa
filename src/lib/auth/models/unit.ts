import { z } from 'zod'

/*
  Setores de Atendimento
  ownerId - Identificador único do dono do setor
*/
export const unitSchema = z.object({
  __typename: z.literal('Unit').default('Unit'),
  id: z.string(),
  ownerId: z.string(),
  members: z
    .array(
      z.object({
        userId: z.string(),
      }),
    )
    .optional(), // Torna opcional, se nem sempre vier no objeto
})

export type Unit = z.infer<typeof unitSchema>
