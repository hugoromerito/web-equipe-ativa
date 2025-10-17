import { z } from 'zod'

import { unitSchema } from '../models/unit'

export const unitSubject = z.tuple([
  z.union([
    z.literal('create'), // Cria um novo setor
    z.literal('get'), // Visualiza um setor
    z.literal('update'), // Atualiza um setor
    z.literal('delete'), // Deleta um setor
    z.literal('transfer_ownership'), // Transfere a propriedade de um setor
    z.literal('manage'), // Gerencia um setor (geralmente é usado para permissões de administrador)
  ]),
  z.union([z.literal('Unit'), unitSchema]),
])

export type UnitSubject = z.infer<typeof unitSubject>
