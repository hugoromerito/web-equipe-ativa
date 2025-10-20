'use client'

import { Loader2, FileText, CheckCircle2, XCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useFormState } from '@/hooks/use-form-state'
import { createConsultaction, type DemandSchema } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useJobTitles } from '@/hooks/use-job-titles'
import { useAvailability } from '@/hooks/use-availability'
import { JobTitleSelector } from '@/components/job-title-selector'
import { TimeSlotGrid } from '@/components/time-slot-grid'

interface DemandFormProps {
  initialData?: DemandSchema
}

export function DemandForm({ initialData }: DemandFormProps) {
  const router = useRouter()
  const params = useParams<{ org: string; unit: string }>()
  const organizationSlug = params.org
  const unitSlug = params.unit

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedJobTitleId, setSelectedJobTitleId] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{
    memberId: string
    date: string
    startTime: string
    endTime: string
  } | null>(null)

  // Buscar cargos
  const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(organizationSlug)

  // Buscar disponibilidade quando um cargo for selecionado
  const { data: availabilityData, isLoading: isLoadingAvailability } = useAvailability({
    organizationSlug,
    unitSlug,
    jobTitleId: selectedJobTitleId,
    enabled: !!selectedJobTitleId,
  })

  const formAction = createConsultaction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.back()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [success, router])

  const handleSlotSelect = (memberId: string, date: string, startTime: string, endTime: string) => {
    setSelectedSlot({ memberId, date, startTime, endTime })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Registrar Nova Consulta</CardTitle>
              <CardDescription>
                Preencha os dados da solicitação e selecione um horário
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

            {/* Hidden fields para agendamento */}
            {selectedSlot && (
              <>
                <input type="hidden" name="memberId" value={selectedSlot.memberId} />
                <input type="hidden" name="date" value={selectedSlot.date} />
                <input type="hidden" name="startTime" value={selectedSlot.startTime} />
                <input type="hidden" name="endTime" value={selectedSlot.endTime} />
              </>
            )}

            <div className="pt-4">
              <Button className="w-full h-11" type="submit" disabled={isPending || !selectedSlot}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registrando consulta...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {selectedSlot ? 'Registrar Consulta' : 'Selecione um horário para continuar'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Seleção de Cargo */}
      <JobTitleSelector
        jobTitles={jobTitles}
        selectedJobTitleId={selectedJobTitleId}
        onJobTitleSelect={setSelectedJobTitleId}
        isLoading={isLoadingJobTitles}
      />

      {/* Agenda de Disponibilidade */}
      {selectedJobTitleId && (
        <TimeSlotGrid
          availability={availabilityData?.members || []}
          isLoading={isLoadingAvailability}
          onSlotSelect={handleSlotSelect}
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  )
}