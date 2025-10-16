import { z } from 'zod'

/*
  Consultas registradas pela população
  id - Identificador único da consulta
  ownerId - Identificador único do paciente da consulta
*/
export const demandSchema = z.object({
  __typename: z.literal('Demand').default('Demand'),
  id: z.string(),
  ownerId: z.string(),
})

export type Demand = z.infer<typeof demandSchema>
