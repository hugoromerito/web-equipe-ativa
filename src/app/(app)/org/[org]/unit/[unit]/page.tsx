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
    <div className="group relative w-full overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800/50">
      <Link href={href} className="block h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
        
        {/* Content Container */}
        <div className="relative z-10 flex min-h-[320px] flex-col justify-between p-6 sm:p-8">
          {/* Header with Icon and Arrow */}
          <div className="flex items-start justify-between">
            <div className={`rounded-2xl ${iconBg} p-4 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
              {icon}
            </div>
            <ArrowUpRight className="size-5 flex-shrink-0 text-slate-400 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
          </div>

          {/* Text Content */}
          <div className="my-6 flex-1">
            <h3 className="mb-3 text-lg font-bold leading-tight text-slate-800 transition-colors duration-500 group-hover:text-white dark:text-slate-100 sm:text-xl">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 transition-colors duration-500 group-hover:text-white/90 dark:text-slate-300 sm:text-base">
              {description}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 w-12 rounded-full bg-slate-200 transition-all duration-500 group-hover:w-full group-hover:bg-white/50 dark:bg-slate-600" />
        </div>

        {/* Floating Elements */}
        <div className="absolute -right-6 -top-6 size-20 rounded-full bg-white/10 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150" />
        <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-white/5 opacity-0 transition-all duration-700 delay-100 group-hover:opacity-100 group-hover:scale-125" />
      </Link>
    </div>
  )
}

function WelcomeSection() {
  return (
    <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl sm:p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-white/10" style={{
          backgroundImage: `radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <Sparkles className="size-8 text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-black sm:text-4xl lg:text-5xl">
          Bem-vindo ao seu
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl">
          Gerencie suas demandas e equipe com facilidade. Selecione uma das opções abaixo para começar.
        </p>
      </div>

      {/* Floating Orbs */}
      <div className="absolute -right-20 -top-20 size-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 size-32 rounded-full bg-white/10 blur-3xl" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-8 px-4 text-center">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-slate-400/20" />
        <div className="relative rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-8 shadow-lg ">
          <UserSearch className="size-16 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Acesso Restrito
        </h3>
        <p className="max-w-md text-slate-600 dark:text-slate-300">
          Parece que você não possui permissões para acessar as funcionalidades. 
          Entre em contato com o administrador para obter acesso.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-1/4 top-1/4 size-2 rounded-full bg-indigo-400 opacity-60" />
      <div className="absolute right-1/3 top-1/3 size-1 rounded-full bg-pink-400 opacity-40" />
      <div className="absolute bottom-1/4 left-1/3 size-3 rounded-full bg-purple-400 opacity-30" />
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
      icon: <NotebookPen strokeWidth={2} className="size-7 text-indigo-600" />,
      title: 'Registrar Demanda',
      description: 'Crie novas solicitações e gerencie demandas de forma intuitiva e eficiente.',
      canAccess: permissions?.can('create', 'Demand') ?? false,
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/30'
    },
    {
      href: `${baseUrl}/demands`,
      icon: <FileSearch strokeWidth={2} className="size-7 text-emerald-600" />,
      title: 'Visualizar Demandas',
      description: 'Consulte, acompanhe e monitore todas as demandas em andamento no sistema.',
      canAccess: permissions?.can('get', 'Demand') ?? false,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      href: `${baseUrl}/members`,
      icon: <UserSearch strokeWidth={2} className="size-7 text-orange-600" />,
      title: 'Visualizar Membros',
      description: 'Gerencie sua equipe, visualize perfis e administre permissões de usuários.',
      canAccess: permissions?.can('get', 'Applicant') ?? false,
      gradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-50 dark:bg-orange-900/30'
    },
  ]

  const visibleActions = actions.filter(action => action.canAccess)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeSection />

        {visibleActions.length > 0 ? (
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => (
                <ActionCard
                  key={action.href}
                  href={action.href}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  canAccess={action.canAccess}
                  gradient={action.gradient}
                  iconBg={action.iconBg}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}