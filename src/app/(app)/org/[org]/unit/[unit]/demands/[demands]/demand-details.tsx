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
  MapPin,
  User,
  Users,
  Landmark,
  Building2,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  Phone,
  ExternalLink,
  Info,
  Eye,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DrawerDemandStatus } from './drawer-demand-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export async function DemandDetails() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentDemand = await getCurrentDemand()

  const { demand } = await getDemand({
    organizationSlug: currentOrg!,
    unitSlug: currentUnit!,
    demandSlug: currentDemand!,
  })

  const address = `${demand.street}, ${demand.number}, ${demand.neighborhood}, ${demand.city}, ${demand.state}, ${demand.zip_code}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

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
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4 md:p-6 medical-layout">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 medical-gradient-primary rounded-3xl blur-xl opacity-20" />
        <Card className="relative medical-card-elevated medical-glass">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold medical-text-gradient">
                  {demand.title}
                </CardTitle>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {demand.description}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <BadgeDemand priority={demand.priority} size="lg" animated>
                {translatePriority(demand.priority).label}
              </BadgeDemand>
              <BadgeDemand status={demand.status} size="lg" animated>
                {translateStatus(demand.status).label}
              </BadgeDemand>
              <BadgeDemand category={demand.category} variant="secondary" size="lg">
                {translateCategory(demand.category).label}
              </BadgeDemand>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Address Information */}
        {(demand.zip_code || demand.street || demand.neighborhood) && (
          <Card className="group medical-card medical-hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="medical-icon-container bg-primary/10 text-primary group-hover:medical-accent-hover">
                  <MapPin className="h-5 w-5" />
                </div>
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {demand.zip_code && (
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">CEP</span>
                    <p className="text-muted-foreground">{demand.zip_code}</p>
                  </div>
                )}
                {demand.city && (
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Cidade</span>
                    <p className="text-muted-foreground">{demand.city}</p>
                  </div>
                )}
                {demand.neighborhood && (
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Bairro</span>
                    <p className="text-muted-foreground">{demand.neighborhood}</p>
                  </div>
                )}
                {demand.street && (
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Endereço</span>
                    <p className="text-muted-foreground">{demand.street}, {demand.number}</p>
                  </div>
                )}
                {demand.complement && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="font-medium text-foreground">Complemento</span>
                    <p className="text-muted-foreground">{demand.complement}</p>
                  </div>
                )}
              </div>
              
              <Link
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="medical-button medical-button-primary group/link"
              >
                <MapPin className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                Ver no Google Maps
                <ExternalLink className="h-3 w-3 opacity-70" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Applicant Information */}
        <Card className="group medical-card medical-hover-lift medical-accent-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="medical-icon-container bg-success/10 text-success group-hover:medical-accent-hover">
                <User className="h-5 w-5" />
              </div>
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 medical-avatar-ring ring-success/20 group-hover:ring-success/30">
                {demand.applicant.avatarUrl && (
                  <AvatarImage src={demand.applicant.avatarUrl} />
                )}
                <AvatarFallback className="bg-success/10 text-success text-lg font-semibold">
                  {demand.applicant.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-lg text-foreground">{demand.applicant.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(demand.applicant.birthdate)
                        .toISOString()
                        .slice(0, 10)
                        .split('-')
                        .reverse()
                        .join('/')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{formatPhone(demand.applicant.phone)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="medical-button medical-button-success group/whats"
            >
              <MessageCircle className="h-4 w-4 group-hover/whats:scale-110 transition-transform" />
              Entrar em contato
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Responsible Member */}
      {demand.member && (
        <Card className="group medical-card medical-hover-lift medical-accent-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="medical-icon-container bg-secondary/10 text-secondary group-hover:medical-accent-hover">
                <Users className="h-5 w-5" />
              </div>
              Responsável pela Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 medical-avatar-ring ring-secondary/20 group-hover:ring-secondary/30">
                {demand.member.user.avatarUrl && (
                  <AvatarImage src={demand.member.user.avatarUrl} />
                )}
                <AvatarFallback className="bg-secondary/10 text-secondary font-semibold">
                  {demand.member.user.name?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{demand.member.user.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {demand.member.user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization & Unit */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group medical-card medical-hover-lift medical-accent-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="medical-icon-container bg-warning/10 text-warning group-hover:medical-accent-hover">
                <Landmark className="h-5 w-5" />
              </div>
              Setor de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-foreground">{demand.unit.name}</p>
          </CardContent>
        </Card>

        <Card className="group medical-card medical-hover-lift medical-accent-info">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="medical-icon-container bg-info/10 text-info group-hover:medical-accent-hover">
                <Building2 className="h-5 w-5" />
              </div>
              Organização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 medical-avatar-ring ring-info/20 group-hover:ring-info/30">
                {demand.unit.organization.avatarUrl && (
                  <AvatarImage src={demand.unit.organization.avatarUrl} />
                )}
                <AvatarFallback className="bg-info/10 text-info font-semibold">
                  {demand.unit.organization.name?.charAt(0) || 'O'}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-foreground">{demand.unit.organization.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owner Information */}
      {demand.owner && (
        <Card className="group medical-card medical-hover-lift medical-accent-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="medical-icon-container bg-accent/10 text-accent group-hover:medical-accent-hover">
                <Eye className="h-5 w-5" />
              </div>
              Registrado por
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 medical-avatar-ring ring-accent/20 group-hover:ring-accent/30">
                {demand.owner.avatarUrl && (
                  <AvatarImage src={demand.owner.avatarUrl} />
                )}
                <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                  {demand.owner.name?.charAt(0) || 'R'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{demand.owner.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {demand.owner.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Information */}
      <Card className="medical-card medical-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="medical-icon-container bg-muted/20 text-muted-foreground">
              <Clock className="h-5 w-5" />
            </div>
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="h-4 w-4" />
                Criado em
              </div>
              <p className="text-muted-foreground ml-6">
                {new Date(demand.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4" />
                Última atualização
              </div>
              <p className="text-muted-foreground ml-6">
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
        </CardContent>
      </Card>

      {/* Action Button */}
      {!['resolved', 'rejected'].includes(demand.status.toLowerCase()) && (
        <div className="sticky bottom-4 md:bottom-6 z-10">
          <DrawerDemandStatus />
        </div>
      )}
    </div>
  )
}