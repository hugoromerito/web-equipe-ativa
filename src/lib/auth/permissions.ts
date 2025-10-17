import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    can('manage', 'all')
    cannot(['transfer_ownership', 'update'], 'Unit')
    can(['transfer_ownership', 'update'], 'Unit', { ownerId: { $eq: user.id } })
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  MANAGER: (_, { can, cannot }) => {
    can('create', 'Applicant') // Pode criar consultas
    can('create', 'Demand') // Pode criar consultas
    can('get', 'Demand') // Pode listar consultas do setor a qual pertence
    can('manage', 'User') // Pode gerenciar usuários
    cannot('delete', 'User') // Não pode deletar um usuário
  },
  CLERK: (user, { can }) => {
    can('get', 'Applicant') // Pode visualizar applicant
    can('create', 'Applicant') // Pode criar applicant
    can('create', 'Demand') // Pode criar consultas
    can('get', 'Demand', { ownerId: { $eq: user.id } }) // Pode listar consultas próprias
    can(['assign', 'create'], 'User') // Pode atribuir consultas e criar usuários
  },
  ANALYST: (_, { can }) => {
    can(['get', 'update'], 'Demand') // Pode listar e atualizar consultas
  },
  // APPLICANT: (user, { can }) => {
  //   can('get', 'Demand', { ownerId: { $eq: user.id } }) // Pode listar consultas
  // },
  BILLING: (_, { can }) => {
    can('manage', 'Billing')
  },
}
