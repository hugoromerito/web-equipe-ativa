import { z } from 'zod'
import { organizationSchema } from '../models/organization'

export const organizationSubject = z.tuple([
  z.union([
    z.literal('create'), // Cria um novo setor
    z.literal('get'), // Visualiza um setor
    z.literal('update'), // Atualiza um setor
    z.literal('delete'), // Deleta um setor
    z.literal('transfer_ownership'), // Transfere a propriedade de uma setor
    z.literal('manage'), // Gerencia um setor (geralmente é usado para permissões de administrador)
  ]),
  z.union([z.literal('Organization'), organizationSchema]),
])

export type OrganizationSubject = z.infer<typeof organizationSubject>
