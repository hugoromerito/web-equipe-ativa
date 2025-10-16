import { Header } from '@/components/header'
import { OrgList } from './org-list'

export default async function Home() {
  return (
    <>
      <Header />
      <main className="medical-layout min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <OrgList />
        </div>
      </main>
    </>
  )
}
