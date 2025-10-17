import { Header } from '@/components/header'
import { OrgList } from './org-list'

export default async function Home() {
  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Médico
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie suas organizações e setores de saúde
          </p>
        </div>
        <OrgList />
      </div>
    </>
  )
}
