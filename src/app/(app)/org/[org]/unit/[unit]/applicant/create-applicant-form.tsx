'use client'

import { AlertTriangle, Loader2, Search, User, Calendar, Phone, Users, CreditCard, FileText, CheckCircle2, XCircle, MapPin } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isCPF } from 'validation-br'
import cepPromise from 'cep-promise'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useFormState } from '@/hooks/use-form-state'
import {
  createApplicantAction,
  getCheckApplicantAction,
  type ApplicantSchema,
} from './actions'
import { Checkbox } from '@/components/ui/checkbox'

interface ApplicantFormProps {
  initialData?: ApplicantSchema
  organizationSlug: string | null
  unitSlug: string | null
}

export function ApplicantForm({
  organizationSlug,
  unitSlug,
}: ApplicantFormProps) {
  const router = useRouter()
  const [showFullForm, setShowFullForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Estados para os campos com checkbox
  const [name, setName] = useState('')
  const [mother, setMother] = useState('')
  const [motherNull, setMotherNull] = useState(false)
  const [father, setFather] = useState('')
  const [ticket, setTicket] = useState('')
  const [fatherNull, setFatherNull] = useState(false)
  const [ticketNull, setTicketNull] = useState(false)

  const [birthdateInput, setBirthdateInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [cpfInput, setCpfInput] = useState('')
  
  // Estados para campos de endereço
  const [susCard, setSusCard] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [complement, setComplement] = useState('')
  const [number, setNumber] = useState('')
  const [numberNull, setNumberNull] = useState(false)
  
  // Estados para controle de busca de CEP
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false)
  const [zipCodeError, setZipCodeError] = useState('')

  const formAction = createApplicantAction
  const [{ errors, message, success, applicantId }, handleSubmit] =
    useFormState(formAction, (state) => {
      if (state.success && state.applicantId) {
        router.push(
          `/org/${organizationSlug}/unit/${unitSlug}/applicant/${state.applicantId}/create-demand`,
        )
      }
    })

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatCPF(value: string) {
    const digits = strip(value).slice(0, 11)
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  function formatPhone(value: string) {
    const digits = strip(value).slice(0, 11)
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  function convertBirthdateToISO(value: string) {
    const digits = strip(value)
    if (digits.length === 8) {
      const day = digits.slice(0, 2)
      const month = digits.slice(2, 4)
      const year = digits.slice(4, 8)
      return `${year}-${month}-${day}`
    }
    return ''
  }

  function formatBirthdate(value: string) {
    const digits = strip(value).slice(0, 8)
    return digits
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
  }

  function formatTicket(value: string) {
    const digits = strip(value).slice(0, 12)
    return digits
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
  }

  function formatCEP(value: string) {
    const digits = strip(value).slice(0, 8)
    return digits.replace(/(\d{5})(\d)/, '$1-$2')
  }

  function formatName(value: string): string {
    return value
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart()
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // useEffect que dispara a busca pelo CEP quando ele tiver 8 dígitos
  useEffect(() => {
    if (zipCode.length === 8) {
      setIsLoadingZipCode(true)
      setZipCodeError('')
      
      cepPromise(zipCode)
        .then((result) => {
          setState(result.state || '')
          setCity(result.city || '')
          setNeighborhood(result.neighborhood || '')
          setStreet(result.street || '')
          setIsLoadingZipCode(false)
        })
        .catch((err) => {
          console.error('Erro ao buscar CEP:', err)
          setZipCodeError('CEP não encontrado')
          setState('')
          setCity('')
          setStreet('')
          setNeighborhood('')
          setIsLoadingZipCode(false)
        })
    } else {
      setZipCodeError('')
      if (zipCode.length === 0) {
        setState('')
        setCity('')
        setStreet('')
        setNeighborhood('')
      }
    }
  }, [zipCode])

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!isCPF(cpfInput)) {
      setErrorMessage('CPF inválido, tente novamente.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('cpf', strip(cpfInput))
      formData.append('organizationSlug', organizationSlug || '')

      const result = await getCheckApplicantAction(formData)

      if (result.success && result.applicant) {
        router.push(
          `/org/${organizationSlug}/unit/${unitSlug}/applicant/${result.applicant.id}/create-demand`,
        )
      } else {
        setErrorMessage(result.message || 'Paciente não encontrado.')
        setShowFullForm(true)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Card de busca por CPF */}
      {!showFullForm && (
        <Card className="border-dashed border-2 hover:border-solid transition-all duration-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">Buscar Paciente</CardTitle>
            <CardDescription>
              Digite o CPF para verificar se o paciente já está cadastrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCpfSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
                <div className="relative">
                  <Input
                    name="cpf"
                    id="cpf"
                    value={formatCPF(cpfInput)}
                    onChange={(e) => {
                      const value = strip(e.target.value).slice(0, 11)
                      setCpfInput(value)
                    }}
                    placeholder="000.000.000-00"
                    className="pl-10 text-center text-lg tracking-wider"
                  />
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button className="w-full h-11" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Paciente
                  </>
                )}
              </Button>

              {errorMessage && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/10">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>CPF não encontrado</AlertTitle>
                  <AlertDescription>
                    {errorMessage} Preencha o formulário abaixo para cadastrar um novo paciente.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário completo */}
      {showFullForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Cadastrar Novo Paciente</CardTitle>
                <CardDescription>
                  Preencha os dados pessoais do paciente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo hidden para organizationSlug */}
              <input type="hidden" name="organizationSlug" value={organizationSlug || ''} />
              
              {/* Alerts de feedback */}
              {success === false && message && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erro ao registrar paciente</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              {success === true && message && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">Sucesso!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">{message}</AlertDescription>
                </Alert>
              )}

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dados Pessoais</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(formatName(e.target.value))}
                      placeholder="Digite o nome completo"
                      className={errors?.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors?.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Data de nascimento *
                    </Label>
                    <Input
                      id="birthdate"
                      value={formatBirthdate(birthdateInput)}
                      onChange={(e) => {
                        const value = strip(e.target.value).slice(0, 8)
                        setBirthdateInput(value)
                      }}
                      placeholder="DD/MM/AAAA"
                      className={errors?.birthdate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <input
                      type="hidden"
                      name="birthdate"
                      value={convertBirthdateToISO(birthdateInput)}
                    />
                    {errors?.birthdate && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.birthdate[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="flex items-center gap-2">
                      <CreditCard className="w-3 h-3" />
                      CPF *
                    </Label>
                    <Input 
                      id="cpf" 
                      defaultValue={formatCPF(cpfInput)} 
                      readOnly 
                      className="bg-muted"
                    />
                    <input type="hidden" name="cpf" value={strip(cpfInput)} />
                    {errors?.cpf && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.cpf[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Telefone *
                    </Label>
                    <Input
                      id="phone"
                      value={formatPhone(phoneInput)}
                      onChange={(e) => {
                        const value = strip(e.target.value).slice(0, 11)
                        setPhoneInput(value)
                      }}
                      placeholder="(00) 00000-0000"
                      className={errors?.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <input type="hidden" name="phone" value={strip(phoneInput)} />
                    {errors?.phone && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.phone[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Filiação */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Filiação</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mother">Nome da mãe</Label>
                    <div className="space-y-3">
                      <Input
                        id="mother"
                        value={motherNull ? '' : mother}
                        onChange={(e) => setMother(formatName(e.target.value))}
                        disabled={motherNull}
                        placeholder="Digite o nome da mãe"
                        className={motherNull ? 'bg-muted' : ''}
                      />
                      <input
                        type="hidden"
                        name="mother"
                        value={motherNull ? 'null' : mother}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="motherNull"
                          checked={motherNull}
                          onCheckedChange={(checked) => {
                            setMotherNull(!!checked)
                            if (checked) setMother('')
                          }}
                        />
                        <Label htmlFor="motherNull" className="text-sm text-muted-foreground cursor-pointer">
                          Não consta
                        </Label>
                      </div>
                    </div>
                    {errors?.mother && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.mother[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="father">Nome do pai</Label>
                    <div className="space-y-3">
                      <Input
                        id="father"
                        value={fatherNull ? '' : father}
                        onChange={(e) => setFather(formatName(e.target.value))}
                        disabled={fatherNull}
                        placeholder="Digite o nome do pai"
                        className={fatherNull ? 'bg-muted' : ''}
                      />
                      <input
                        type="hidden"
                        name="father"
                        value={fatherNull ? 'null' : father}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fatherNull"
                          checked={fatherNull}
                          onCheckedChange={(checked) => {
                            setFatherNull(!!checked)
                            if (checked) setFather('')
                          }}
                        />
                        <Label htmlFor="fatherNull" className="text-sm text-muted-foreground cursor-pointer">
                          Não consta
                        </Label>
                      </div>
                    </div>
                    {errors?.father && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.father[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Endereço */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Endereço</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        name="zip_code"
                        value={formatCEP(zipCode)}
                        onChange={(e) => {
                          const value = strip(e.target.value).slice(0, 8)
                          setZipCode(value)
                        }}
                        placeholder="00000-000"
                        className={zipCodeError || errors?.zip_code ? 'border-red-500' : ''}
                      />
                      {isLoadingZipCode && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {zipCodeError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {zipCodeError}
                      </p>
                    )}
                    {errors?.zip_code && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.zip_code[0]}
                      </p>
                    )}
                    {!zipCodeError && !errors?.zip_code && zipCode.length === 8 && !isLoadingZipCode && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        CEP encontrado
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="SP"
                      maxLength={2}
                      disabled={isLoadingZipCode}
                      className={isLoadingZipCode ? 'bg-muted' : ''}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      disabled={isLoadingZipCode}
                      className={isLoadingZipCode ? 'bg-muted' : ''}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="street">Rua/Avenida</Label>
                    <Input
                      id="street"
                      name="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua das Flores"
                      disabled={isLoadingZipCode}
                      className={isLoadingZipCode ? 'bg-muted' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Centro"
                      disabled={isLoadingZipCode}
                      className={isLoadingZipCode ? 'bg-muted' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">
                      Número {zipCode.length > 0 && !numberNull && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="space-y-3">
                      <Input
                        id="number"
                        name="number"
                        value={numberNull ? '' : number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        disabled={numberNull}
                        className={numberNull ? 'bg-muted' : (errors?.number ? 'border-red-500' : '')}
                      />
                      <input
                        type="hidden"
                        name="numberNull"
                        value={numberNull ? 'true' : 'false'}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numberNull"
                          checked={numberNull}
                          onCheckedChange={(checked) => {
                            setNumberNull(!!checked)
                            if (checked) setNumber('')
                          }}
                        />
                        <Label htmlFor="numberNull" className="text-sm text-muted-foreground cursor-pointer">
                          Sem número
                        </Label>
                      </div>
                    </div>
                    {errors?.number && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.number[0]}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="complement">
                      Complemento {zipCode.length > 0 && numberNull && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 101, Bloco B"
                      className={errors?.complement ? 'border-red-500' : ''}
                    />
                    {numberNull && zipCode.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Obrigatório quando não há número
                      </p>
                    )}
                    {errors?.complement && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.complement[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Documentos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Documentos</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="susCard">Cartão SUS</Label>
                  <Input
                    id="susCard"
                    name="sus_card"
                    value={susCard}
                    onChange={(e) => {
                      const value = strip(e.target.value).slice(0, 15)
                      setSusCard(value)
                    }}
                    placeholder="000 0000 0000 0000"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticket">Título de eleitor</Label>
                  <div className="space-y-3">
                    <Input
                      id="ticket"
                      value={ticketNull ? '' : formatTicket(ticket)}
                      onChange={(e) => {
                        const value = strip(e.target.value).slice(0, 12)
                        setTicket(value)
                      }}
                      disabled={ticketNull}
                      placeholder="0000 0000 0000"
                      className={ticketNull ? 'bg-muted' : ''}
                    />
                    <input
                      type="hidden"
                      name="ticket"
                      value={ticketNull ? 'null' : ticket}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ticketNull"
                        checked={ticketNull}
                        onCheckedChange={(checked) => {
                          setTicketNull(!!checked)
                          if (checked) setTicket('')
                        }}
                      />
                      <Label htmlFor="ticketNull" className="text-sm text-muted-foreground cursor-pointer">
                        Não consta
                      </Label>
                    </div>
                  </div>
                  {errors?.ticket && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.ticket[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observation">Observações</Label>
                  <Input 
                    name="observation" 
                    id="observation" 
                    placeholder="Informações adicionais (opcional)"
                  />
                  {errors?.observation && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.observation[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full h-11" type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Cadastrando paciente...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Cadastrar Paciente
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}