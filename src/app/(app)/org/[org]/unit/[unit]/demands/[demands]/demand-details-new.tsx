import { getCurrentDemand, getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { BadgeDemand } from '@/components/badge-demand'
import {
  translateCategory,
  translatePriority,
  translateStatus,
} from '@/constants/demand-translations'
import { getDemand } from '@/http/get-demand'
import Link from 'next/link'
import {
  User,
  Users,
  Landmark,
  Building2,
  Mail,
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header - Minimalista */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              {demand.title}
            </h1>
            <p className="text-slate-600 text-sm">
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
        <div className="pt-2 border-t border-slate-100">
          <BadgeDemand category={demand.category} variant="secondary" size="sm">
            {translateCategory(demand.category).label}
          </BadgeDemand>
        </div>
      </div>

      {/* Lista de Informações - Clean & Minimal */}
      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {/* Paciente */}
        <div className="p-5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12 border-2 border-slate-200">
                {demand.applicant.avatarUrl && (
                  <AvatarImage src={demand.applicant.avatarUrl} />
                )}
                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                  {demand.applicant.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-500 uppercase">Paciente</span>
                </div>
                <h3 className="font-semibold text-slate-900 truncate">{demand.applicant.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                  <span>{new Date(demand.applicant.birthdate).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>{formatPhone(demand.applicant.phone)}</span>
                </div>
              </div>
            </div>
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
          </div>
        </div>

        {/* Profissional Responsável */}
        {demand.member && (
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-slate-200">
                {demand.member.user.avatarUrl && (
                  <AvatarImage src={demand.member.user.avatarUrl} />
                )}
                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                  {demand.member.user.name?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-500 uppercase">Profissional</span>
                </div>
                <h3 className="font-semibold text-slate-900 truncate">{demand.member.user.name}</h3>
                <p className="text-xs text-slate-600 truncate">{demand.member.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Agendamento */}
        {demand.scheduledDate && (
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-500 uppercase">Agendamento</span>
                </div>
                <h3 className="font-semibold text-slate-900">
                  {new Date(demand.scheduledDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                  {demand.scheduledTime && (
                    <span className="ml-2 text-slate-600">
                      às {demand.scheduledTime.substring(0, 5)}
                    </span>
                  )}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Unidade */}
        <div className="p-5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-500 uppercase">Unidade</span>
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{demand.unit.name}</h3>
            </div>
          </div>
        </div>

        {/* Organização */}
        <div className="p-5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-slate-200">
              {demand.unit.organization.avatarUrl && (
                <AvatarImage src={demand.unit.organization.avatarUrl} />
              )}
              <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                {demand.unit.organization.name?.charAt(0) || 'O'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-500 uppercase">Organização</span>
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{demand.unit.organization.name}</h3>
            </div>
          </div>
        </div>

        {/* Registrado por */}
        {demand.owner && (
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-slate-200">
                {demand.owner.avatarUrl && (
                  <AvatarImage src={demand.owner.avatarUrl} />
                )}
                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                  {demand.owner.name?.charAt(0) || 'R'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-500 uppercase">Registrado por</span>
                </div>
                <h3 className="font-semibold text-slate-900 truncate">{demand.owner.name}</h3>
                <p className="text-xs text-slate-600 truncate">{demand.owner.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Histórico */}
        <div className="p-5 bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase">Histórico</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Criado em:</span>
              <p className="font-medium text-slate-900 mt-1">
                {new Date(demand.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <span className="text-slate-600">Atualizado em:</span>
              <p className="font-medium text-slate-900 mt-1">
                {new Date(demand.updatedAt!).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
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
