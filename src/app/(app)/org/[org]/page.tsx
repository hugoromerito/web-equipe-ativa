import { Header } from '@/components/header'
import { UnitList } from './unit-list'

export default async function OrganizationUnits() {
  return (
    <>
      <Header />
      <div className="space-y-8">
        <UnitList />
      </div>
    </>
  )
}
