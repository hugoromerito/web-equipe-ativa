import { getCurrentDemand, getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { BadgeDemand } from '@/components/badge-demand'
import {
  translateCategory,
  translatePriority,
  translateStatus,
} from '@/constants/demand-translations'
import { getDemand } from '@/http/get-demand'
import { formatLocalDate, formatTime, formatTimestamp } from '@/utils/date-utils'
import Link from 'next/link'
import {
  User,
  Users,
  Landmark,
  Building2,
  MessageCircle,
  Calendar,
  Clock,
  Eye,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DrawerDemandStatus } from './drawer-demand-status'

export async function DemandDetails() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentDemand = await getCurrentDemand()

  const { demand } = await getDemand({
    organizationSlug: currentOrg!,
    unitSlug: currentUnit!,
    demandSlug: currentDemand!,
  })

  const phone = demand.applicant.phone
  const whatsappLink = `https://api.whatsapp.com/send/?phone=55${phone}&text&type=phone_number&app_absent=0`

  function strip(value: string): string {
    return value.replace(/\D/g, '')
  }

  function formatPhone(value: string) {
    const digits = strip(value).slice(0, 11)
    const ddd = digits.slice(0, 2)
    const first = digits.slice(2, 7)
    const second = digits.slice(7, 11)
    return `(${ddd}) ${first}-${second}`
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header - Elegante */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-5">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {demand.title}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              {demand.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <BadgeDemand priority={demand.priority} size="sm">
              {translatePriority(demand.priority).label}
            </BadgeDemand>
            <BadgeDemand status={demand.status} size="sm">
              {translateStatus(demand.status).label}
            </BadgeDemand>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <BadgeDemand category={demand.category} variant="secondary" size="sm">
            {translateCategory(demand.category).label}
          </BadgeDemand>
        </div>
      </div>

      {/* Lista de Informações - Profissional & Elegante */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {/* Paciente */}
        <div className="p-6 hover:bg-slate-50/50 transition-all duration-200">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 border-2 border-slate-200 shadow-sm">
              {demand.applicant.avatarUrl && (
                <AvatarImage src={demand.applicant.avatarUrl} />
              )}
              <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 font-bold text-lg">
                {demand.applicant.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-emerald-50">
                  <User className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{demand.applicant.name}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {formatLocalDate(demand.applicant.birthdate)}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  {formatPhone(demand.applicant.phone)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/org/${currentOrg}/unit/${currentUnit}/applicant/${demand.applicant.id}/info`}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 hover:shadow-md transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Ver perfil</span>
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Profissional Responsável */}
        {demand.member && (
          <div className="p-6 hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 border-2 border-slate-200 shadow-sm">
                {demand.member.user.avatarUrl && (
                  <AvatarImage src={demand.member.user.avatarUrl} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-lg">
                  {demand.member.user.name?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-blue-50">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profissional Responsável</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{demand.member.user.name}</h3>
                <p className="text-sm text-slate-600 truncate">{demand.member.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {!demand.member && (
          <div className="p-6 bg-amber-50/30 border-l-4 border-amber-400">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Aguardando Atribuição</p>
                <p className="text-xs text-amber-600">Nenhum profissional foi designado para esta demanda</p>
              </div>
            </div>
          </div>
        )}

        {/* Agendamento */}
        {demand.scheduledDate && (
          <div className="p-6 hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 flex items-center justify-center shadow-sm flex-shrink-0">
                <Calendar className="h-7 w-7 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-purple-50">
                    <Clock className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agendamento</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {formatLocalDate(demand.scheduledDate, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                  {demand.scheduledTime && (
                    <span className="ml-3 text-purple-600 font-bold">
                      {formatTime(demand.scheduledTime)}
                    </span>
                  )}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações Secundárias - Discretas */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-5 py-3 border-b border-slate-200/60">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />
            Informações Administrativas
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          <div className='md:flex md:justify-between'>
          {/* Organização - Compacta */}
          <div className="px-5 py-3 hover:bg-slate-50/30 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-slate-200">
                {demand.unit.organization.avatarUrl && (
                  <AvatarImage src={demand.unit.organization.avatarUrl} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 font-semibold text-xs">
                  {demand.unit.organization.name?.charAt(0) || 'O'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">Organização</p>
                <p className="font-semibold text-sm text-slate-700 truncate">{demand.unit.organization.name}</p>
              </div>
            </div>
          </div>

          {/* Unidade - Compacta */}
          <div className="px-5 py-3 hover:bg-slate-50/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-amber-50">
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">Unidade</p>
                <p className="font-semibold text-sm text-slate-700 truncate">{demand.unit.name}</p>
              </div>
            </div>
          </div>

          {/* Registrado por - Compacto */}
          {demand.owner && (
            <div className="px-5 py-3 hover:bg-slate-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-slate-200">
                  {demand.owner.avatarUrl && (
                    <AvatarImage src={demand.owner.avatarUrl} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 font-semibold text-xs">
                    {demand.owner.name?.charAt(0) || 'R'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">Registrado por</p>
                  <p className="font-semibold text-sm text-slate-700 truncate">{demand.owner.name}</p>
                  <p className="text-xs text-slate-500 truncate">{demand.owner.email}</p>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Histórico - Compacto */}
          <div className="px-5 py-3 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Histórico</span>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Criado em</p>
                <p className="font-semibold text-sm text-slate-700">
                  {formatTimestamp(demand.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Atualizado em</p>
                {demand.updatedAt ? (
                  <p className="font-semibold text-sm text-slate-700">
                    {formatTimestamp(demand.updatedAt)}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Não atualizada
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button - Sempre visível, exceto para BILLED */}
      {demand.status !== 'BILLED' && (
        <div className="sticky bottom-4 md:bottom-6 z-10">
          <DrawerDemandStatus currentStatus={demand.status as any} />
        </div>
      )}
    </div>
  )
}