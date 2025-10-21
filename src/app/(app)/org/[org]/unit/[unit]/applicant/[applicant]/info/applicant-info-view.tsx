'use client'

import { 
  User, Calendar, Phone, FileText, MapPin, Users, 
  Heart, CreditCard, Stethoscope, AlertCircle, Edit,
  Mail, Home, Building, Navigation, Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatLocalDate } from '@/utils/date-utils'
import Link from 'next/link'

interface Applicant {
  id: string
  name: string
  birthdate: string
  phone: string | null
  cpf: string | null
  ticket: string | null
  sus_card: string | null
  mother: string | null
  father: string | null
  zip_code: string | null
  state: string | null
  city: string | null
  street: string | null
  neighborhood: string | null
  complement: string | null
  number: string | null
  observation: string | null
  created_at: string
  updated_at: string | null
}

interface ApplicantInfoViewProps {
  applicant: Applicant | null
  error: string | null
  currentOrg: string
  currentApplicant: string
}

export function ApplicantInfoView({ 
  applicant, 
  error,
  currentOrg,
  currentApplicant 
}: ApplicantInfoViewProps) {
  if (error) {
    return (
      <div className="w-full max-w-6xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar informações</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="w-full max-w-6xl px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Paciente não encontrado</AlertTitle>
          <AlertDescription>
            Não foi possível encontrar as informações do paciente.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Calcular idade
  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const age = applicant.birthdate ? calculateAge(applicant.birthdate) : null

  // Funções de formatação
  const formatPhone = (phone: string | null) => {
    if (!phone) return null
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return phone
  }

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return null
    const digits = cpf.replace(/\D/g, '')
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    }
    return cpf
  }

  const formatCEP = (cep: string | null) => {
    if (!cep) return null
    const digits = cep.replace(/\D/g, '')
    if (digits.length === 8) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`
    }
    return cep
  }

  // Verificar completude dos dados
  const requiredFields = ['name', 'birthdate', 'phone', 'cpf']
  const optionalFields = ['sus_card', 'ticket', 'mother', 'father', 'street', 'city', 'state', 'zip_code']
  
  const filledRequired = requiredFields.filter(field => applicant[field as keyof Applicant]).length
  const filledOptional = optionalFields.filter(field => applicant[field as keyof Applicant]).length
  const completeness = Math.round(((filledRequired + filledOptional) / (requiredFields.length + optionalFields.length)) * 100)

  return (
    <div className="w-full max-w-6xl px-4 py-8 space-y-6">
      {/* Header do Paciente */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {applicant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {applicant.name}
                  {age !== null && (
                    <Badge variant="secondary" className="text-sm font-normal">
                      {age} anos
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Cadastrado em {formatLocalDate(applicant.created_at)}
                </CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href={`/org/${currentOrg}/unit/unit/applicant/${currentApplicant}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
            </Button>
          </div>

          {/* Barra de Completude */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Perfil completo</span>
              <span className="font-semibold">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  completeness >= 80 ? 'bg-green-500' :
                  completeness >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem 
              icon={<User className="w-4 h-4" />}
              label="Nome Completo"
              value={applicant.name}
            />
            <InfoItem 
              icon={<Calendar className="w-4 h-4" />}
              label="Data de Nascimento"
              value={applicant.birthdate ? formatLocalDate(applicant.birthdate) : null}
              badge={age ? `${age} anos` : undefined}
            />
            <InfoItem 
              icon={<Phone className="w-4 h-4" />}
              label="Telefone"
              value={formatPhone(applicant.phone)}
            />
            <InfoItem 
              icon={<FileText className="w-4 h-4" />}
              label="CPF"
              value={formatCPF(applicant.cpf)}
            />
          </CardContent>
        </Card>

        {/* Documentos e Cartões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Documentos e Cartões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem 
              icon={<Heart className="w-4 h-4" />}
              label="Cartão SUS"
              value={applicant.sus_card}
            />
            <InfoItem 
              icon={<Stethoscope className="w-4 h-4" />}
              label="Ticket/Convênio"
              value={applicant.ticket}
            />
          </CardContent>
        </Card>

        {/* Filiação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Filiação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem 
              icon={<User className="w-4 h-4" />}
              label="Nome da Mãe"
              value={applicant.mother}
            />
            <InfoItem 
              icon={<User className="w-4 h-4" />}
              label="Nome do Pai"
              value={applicant.father}
            />
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem 
              icon={<Navigation className="w-4 h-4" />}
              label="CEP"
              value={formatCEP(applicant.zip_code)}
            />
            <InfoItem 
              icon={<Home className="w-4 h-4" />}
              label="Rua"
              value={applicant.street}
              extra={applicant.number ? `Nº ${applicant.number}` : undefined}
            />
            <InfoItem 
              icon={<Building className="w-4 h-4" />}
              label="Bairro"
              value={applicant.neighborhood}
            />
            <InfoItem 
              icon={<MapPin className="w-4 h-4" />}
              label="Cidade/Estado"
              value={applicant.city && applicant.state ? `${applicant.city} - ${applicant.state}` : applicant.city || applicant.state}
            />
            {applicant.complement && (
              <InfoItem 
                icon={<Info className="w-4 h-4" />}
                label="Complemento"
                value={applicant.complement}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {applicant.observation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {applicant.observation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rodapé com Metadados */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold">ID:</span> {applicant.id}
            </div>
            <div>
              <span className="font-semibold">Cadastrado em:</span> {formatLocalDate(applicant.created_at)}
            </div>
            {applicant.updated_at && (
              <div>
                <span className="font-semibold">Última atualização:</span> {formatLocalDate(applicant.updated_at)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente auxiliar para exibir informações
interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
  badge?: string
  extra?: string
}

function InfoItem({ icon, label, value, badge, extra }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        {value ? (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">
              {value}
            </p>
            {extra && (
              <span className="text-xs text-muted-foreground">
                {extra}
              </span>
            )}
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Não informado
          </p>
        )}
      </div>
    </div>
  )
}
