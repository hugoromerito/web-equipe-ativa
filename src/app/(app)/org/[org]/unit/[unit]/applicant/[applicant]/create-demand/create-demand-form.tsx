'use client'

import { AlertTriangle, Loader2, FileText, MapPin, Search, CheckCircle2, XCircle, Map, Building, Hash } from 'lucide-react'
import cepPromise from 'cep-promise'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { useFormState } from '@/hooks/use-form-state'
import { createConsultaction, type DemandSchema } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DemandFormProps {
  initialData?: DemandSchema
}

export function DemandForm({ initialData }: DemandFormProps) {
  const router = useRouter()
  const [zipCodeInput, setZipCodeInput] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false)
  const [zipCodeError, setZipCodeError] = useState('')

  // Estado para armazenar os dados do endereço
  const [address, setAddress] = useState({
    state: '',
    city: '',
    street: '',
    neighborhood: '',
  })

  const formAction = createConsultaction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatZipCode(value: string) {
    const digits = strip(value).slice(0, 8)
    return digits.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }

  // useEffect que dispara a busca pelo ZipCode quando ele tiver 8 dígitos
  useEffect(() => {
    if (zipCodeInput.length === 8) {
      setIsLoadingZipCode(true)
      setZipCodeError('')
      
      cepPromise(zipCodeInput)
        .then((result) => {
          setAddress({
            state: result.state || '',
            city: result.city || '',
            neighborhood: result.neighborhood || '',
            street: result.street || '',
          })
          setIsLoadingZipCode(false)
        })
        .catch((err) => {
          console.error('Erro ao buscar CEP:', err)
          setZipCodeError('CEP não encontrado')
          setAddress({
            state: '',
            city: '',
            street: '',
            neighborhood: '',
          })
          setIsLoadingZipCode(false)
        })
    } else {
      setZipCodeError('')
      setAddress({
        state: '',
        city: '',
        street: '',
        neighborhood: '',
      })
    }
  }, [zipCodeInput])

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.back()
      }, 1000) // tempo para mostrar o alerta de sucesso

      return () => clearTimeout(timeout)
    }
  }, [success])

  const hasAddressData = address.state || address.city || address.neighborhood || address.street

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Registrar Nova Consulta</CardTitle>
              <CardDescription>
                Preencha os dados da solicitação e endereço
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerts de feedback */}
            {success === false && message && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Erro ao registrar consulta</AlertTitle>
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

            {/* Dados da Consulta */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dados da Consulta</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título da consulta *</Label>
                <Input
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    const formatted = title
                      .trim()
                      .replace(/\s+/g, ' ')
                      .toLowerCase()
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    setTitle(formatted)
                  }}
                  placeholder="Ex: Solicitação de certidão de nascimento"
                  className={errors?.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors?.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.title[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição da solicitação *</Label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Descreva detalhadamente a solicitação, incluindo documentos necessários e informações relevantes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => {
                    const formatted = description
                      .trim()
                      .replace(/\s+/g, ' ')
                      .toLowerCase()
                      .replace(/(?:^|[.?!]\s*)(\p{Ll})/gu, (match) =>
                        match.toUpperCase(),
                      )
                    setDescription(formatted)
                  }}
                  className={`min-h-[120px] resize-none ${errors?.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors?.description && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.description[0]}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Endereço da Consulta</h3>
              </div>

              {/* ZipCode com indicador de loading */}
              <div className="space-y-2">
                <Label htmlFor="zip_code" className="flex items-center gap-2">
                  <Search className="w-3 h-3" />
                  CEP *
                </Label>
                <div className="relative">
                  <Input
                    name="zip_code"
                    id="zip_code"
                    value={formatZipCode(zipCodeInput)}
                    onChange={(e) => {
                      const value = strip(e.target.value).slice(0, 8)
                      setZipCodeInput(value)
                    }}
                    placeholder="00000-000"
                    className={`${errors?.zip_code || zipCodeError ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isLoadingZipCode ? 'pr-10' : ''}`}
                  />
                  {isLoadingZipCode && (
                    <div className="absolute right-3 top-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {hasAddressData && !isLoadingZipCode && (
                    <div className="absolute right-3 top-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                <input type="hidden" name="zip_code" value={strip(zipCodeInput)} />
                {(errors?.zip_code || zipCodeError) && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors?.zip_code?.[0] || zipCodeError}
                  </p>
                )}
                {hasAddressData && (
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Endereço encontrado
                    </Badge>
                  </div>
                )}
              </div>

              {/* Grid de endereço */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-2">
                    <Map className="w-3 h-3" />
                    Estado *
                  </Label>
                  <Input
                    name="state"
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Ex: RJ"
                    className={errors?.state ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.state && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.state[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <Building className="w-3 h-3" />
                    Cidade *
                  </Label>
                  <Input
                    name="city"
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Ex: Rio de Janeiro"
                    className={errors?.city ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.city && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.city[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    name="neighborhood"
                    id="neighborhood"
                    value={address.neighborhood}
                    onChange={(e) =>
                      setAddress({ ...address, neighborhood: e.target.value })
                    }
                    placeholder="Ex: Centro"
                    className={errors?.neighborhood ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.neighborhood && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.neighborhood[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Logradouro *</Label>
                  <Input
                    name="street"
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Ex: Rua das Flores"
                    className={errors?.street ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.street && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.street[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number" className="flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    Número
                  </Label>
                  <Input 
                    name="number" 
                    type="number" 
                    id="number" 
                    placeholder="123"
                    className={errors?.number ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.number && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.number[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input 
                    name="complement" 
                    id="complement" 
                    placeholder="Apt 101, Bloco A..."
                    className={errors?.complement ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors?.complement && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.complement[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full h-11" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registrando consulta...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Registrar Consulta
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}