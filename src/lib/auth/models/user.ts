import { z } from 'zod'

import { roleSchema } from '../roles'

export const userSchema = z.object({
  id: z.string(),
  orgRole: roleSchema,
  unitRole: roleSchema,
})

export type User = z.infer<typeof userSchema>
