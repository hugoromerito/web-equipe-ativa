import { TVDisplayWithWebSocket } from './tv-display-websocket'
import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'

export default async function TVDisplayPage() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  if (!currentOrg || !currentUnit) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-2xl">Erro: Organização ou unidade não encontrada</p>
      </div>
    )
  }

  return <TVDisplayWithWebSocket organizationSlug={currentOrg} unitSlug={currentUnit} />
}
