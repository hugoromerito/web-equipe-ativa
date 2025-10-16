import { Header } from '@/components/header'
import { UnitList } from './unit-list'

export default async function OrganizationUnits() {
  return (
    <>
      <Header />
      <main className="medical-layout min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <UnitList />
        </div>
      </main>
    </>
  )
}
