import { ability, getCurrentOrg, getCurrentUnit } from '@/lib/auth'

import { Button } from './ui/button'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  const permissions = await ability()

  const canCreateDemands = permissions?.can('create', 'Demand')
  const canGetDemands = permissions?.can('get', 'Demand')
  const canGetMembers = permissions?.can('get', 'Applicant')
  const canGetPatients = permissions?.can('get', 'Applicant') // Usar a mesma permissão de applicants
  const canGetUnits = permissions?.can('get', 'Unit')

  return (
    <nav className="medical-nav">
      {canGetUnits && (
        <NavLink 
          href={`/org/${currentOrg}`}
          className="medical-nav-item data-[current=true]:medical-nav-item-active"
        >
          Setores
        </NavLink>
      )}

      {canCreateDemands && currentUnit && (
        <NavLink 
          href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}
          className="medical-nav-item data-[current=true]:medical-nav-item-active"
        >
          Registrar consultas
        </NavLink>
      )}

      {canGetDemands && currentUnit && (
        <NavLink 
          href={`/org/${currentOrg}/unit/${currentUnit}/demands`}
          className="medical-nav-item data-[current=true]:medical-nav-item-active"
        >
          Visualizar consultas
        </NavLink>
      )}

      {canGetPatients && (
        <NavLink 
          href={`/org/${currentOrg}/patients`}
          className="medical-nav-item data-[current=true]:medical-nav-item-active"
        >
          Pacientes
        </NavLink>
      )}
      
      {canGetMembers && currentUnit && (
        <NavLink 
          href={`/org/${currentOrg}/unit/${currentUnit}/members`}
          className="medical-nav-item data-[current=true]:medical-nav-item-active"
        >
          Visualizar membros
        </NavLink>
      )}
    </nav>
  )
}
