import { FileSearch, NotebookPen, UserSearch, ArrowUpRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ability, getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

interface ActionCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  canAccess: boolean
  gradient: string
  iconBg: string
}

function ActionCard({ href, icon, title, description, canAccess, gradient, iconBg }: ActionCardProps) {
  if (!canAccess) return null

  return (
    <div className="group medical-card p-6 hover:shadow-xl transition-all duration-300 medical-fade-in">
      <Link href={href} className="block h-full">
        {/* Content Container */}
        <div className="flex flex-col justify-between min-h-[280px]">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-6">
            <div className={`rounded-xl ${iconBg} p-4 group-hover:scale-105 transition-transform duration-300`}>
              {icon}
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* Text Content */}
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 mb-3">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 w-12 rounded-full bg-slate-200 group-hover:w-full group-hover:bg-blue-500 transition-all duration-300" />
        </div>
      </Link>
    </div>
  )
}

function WelcomeSection() {
  return (
    <div className="medical-card p-8 sm:p-12 mb-12 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
      {/* Content */}
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          Dashboard Médico
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Gerencie suas demandas médicas e equipe com eficiência. Selecione uma das opções abaixo para começar.
        </p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="medical-card p-12 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <UserSearch className="w-10 h-10 text-slate-400" />
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-3">
        Acesso Restrito
      </h3>
      <p className="text-slate-600">
        Você não possui permissões para acessar as funcionalidades. 
        Entre em contato com o administrador para obter acesso.
      </p>
    </div>
  )
}

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const permissions = await ability()
  const baseUrl = `/org/${currentOrg}/unit/${currentUnit}`

  const actions = [
    {
      href: `${baseUrl}/applicant`,
      icon: <NotebookPen strokeWidth={2} className="w-7 h-7 text-blue-600" />,
      title: 'Registrar Demanda',
      description: 'Crie novas demandas médicas e gerencie solicitações de forma intuitiva e eficiente.',
      canAccess: permissions?.can('create', 'Demand') ?? false,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      href: `${baseUrl}/demands`,
      icon: <FileSearch strokeWidth={2} className="w-7 h-7 text-emerald-600" />,
      title: 'Visualizar Demandas',
      description: 'Consulte, acompanhe e monitore todas as demandas médicas em andamento no sistema.',
      canAccess: permissions?.can('get', 'Demand') ?? false,
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      href: `${baseUrl}/members`,
      icon: <UserSearch strokeWidth={2} className="w-7 h-7 text-amber-600" />,
      title: 'Equipe Médica',
      description: 'Gerencie sua equipe médica, visualize perfis e administre permissões de usuários.',
      canAccess: permissions?.can('get', 'Applicant') ?? false,
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-50'
    },
  ]

  const visibleActions = actions.filter(action => action.canAccess)

  return (
    <div className="medical-layout min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <WelcomeSection />

        {visibleActions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((action, index) => (
              <div key={action.href} style={{ animationDelay: `${index * 100}ms` }}>
                <ActionCard
                  href={action.href}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  canAccess={action.canAccess}
                  gradient={action.gradient}
                  iconBg={action.iconBg}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}