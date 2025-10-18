import { ability } from '@/lib/auth'
import { MemberList } from './member-list'
import { Header } from '@/components/header'

export default async function MembersPage() {
  const permissions = await ability()

  return (
    <div className="min-h-screen medical-layout">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full">
          {permissions?.can('get', 'User') && <MemberList />}
          {!permissions?.can('get', 'User') && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
                <p className="text-muted-foreground">
                  Você não tem permissão para visualizar os membros desta organização.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}