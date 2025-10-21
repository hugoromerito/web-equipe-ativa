'use client'

import { Loader2, FileText, CheckCircle2, XCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useFormState } from '@/hooks/use-form-state'
import { createConsultaction, type DemandSchema, type SlotResult } from './actions'
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
    memberName?: string
  } | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<{
    memberId: string
    date: string
    startTime: string
    endTime: string
    memberName?: string
  }[]>([])

  // Buscar cargos
  const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(organizationSlug)

  // Buscar disponibilidade quando um cargo for selecionado
  const { data: availabilityData, isLoading: isLoadingAvailability } = useAvailability({
    organizationSlug,
    unitSlug,
    jobTitleId: selectedJobTitleId,
    enabled: !!selectedJobTitleId,
  })

  // Criar mapa de membros para buscar nomes
  const memberMap = new Map(
    (availabilityData?.members || []).map(m => [m.memberId, m.memberName])
  )

  const formAction = createConsultaction

  const [formState, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  const { errors, message, success } = formState

  // Removido redirecionamento automático após sucesso

  const handleSlotSelect = (memberId: string, date: string, startTime: string, endTime: string) => {
    // Compatibilidade: quando usado em modo single-select
    setSelectedSlot({ memberId, date, startTime, endTime })
  }

  const handleSelectionChange = (slots: { memberId: string; date: string; startTime: string; endTime: string }[]) => {
    // Enriquecer slots com memberName
    const enrichedSlots = slots.map(s => ({
      ...s,
      memberName: memberMap.get(s.memberId) || 'Profissional'
    }))
    setSelectedSlots(enrichedSlots)
    // keep first as selectedSlot for backward compatibility
    setSelectedSlot(enrichedSlots.length > 0 ? enrichedSlots[0] : null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Modal de sucesso centralizado com detalhes */}
      {success === true && message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 max-w-lg w-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">Demanda registrada!</h2>
            <p className="text-green-700 dark:text-green-300 text-center text-lg font-medium">{message}</p>
            {/* Detalhes dos slots */}
            {'results' in formState && Array.isArray(formState.results) && formState.results.length > 0 && (
              <div className="w-full space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground text-center">Detalhes dos horários:</h4>
                <div className="space-y-2">
                  {(formState.results as SlotResult[]).map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border justify-center ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          result.success 
                            ? 'text-green-900 dark:text-green-100' 
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          {result.slot}
                        </div>
                        {!result.success && result.error && (
                          <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => window.location.reload()} className="mt-4">Registrar nova demanda</Button>
          </div>
        </div>
      )}
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

            {/* Resultados detalhados por slot */}
            {'results' in formState && Array.isArray(formState.results) && formState.results.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Detalhes:</h4>
                <div className="space-y-2">
                  {(formState.results as SlotResult[]).map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          result.success 
                            ? 'text-green-900 dark:text-green-100' 
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          {result.slot}
                        </div>
                        {!result.success && result.error && (
                          <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

            {/* Hidden fields para agendamento (suporta múltiplos slots) */}
            {selectedSlots.length > 0 ? (
              selectedSlots.map((s, idx) => (
                <div key={`${s.memberId}-${s.date}-${s.startTime}`}>
                  <input type="hidden" name={`slots[${idx}][memberId]`} value={s.memberId} />
                  <input type="hidden" name={`slots[${idx}][date]`} value={s.date} />
                  <input type="hidden" name={`slots[${idx}][startTime]`} value={s.startTime} />
                  <input type="hidden" name={`slots[${idx}][endTime]`} value={s.endTime} />
                  <input type="hidden" name={`slots[${idx}][memberName]`} value={s.memberName || ''} />
                </div>
              ))
            ) : selectedSlot ? (
              <>
                <input type="hidden" name="memberId" value={selectedSlot.memberId} />
                <input type="hidden" name="date" value={selectedSlot.date} />
                <input type="hidden" name="startTime" value={selectedSlot.startTime} />
                <input type="hidden" name="endTime" value={selectedSlot.endTime} />
              </>
            ) : null}

            {/* Preview dos slots selecionados */}
            {selectedSlots.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Horários selecionados ({selectedSlots.length})</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSlots.map((s) => {
                    const formattedDate = new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR')
                    return (
                      <div key={`${s.memberId}-${s.date}-${s.startTime}`} className="p-3 border rounded-lg flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div>
                          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            {formattedDate} às {s.startTime}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            {s.memberName || 'Profissional'}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" 
                          onClick={() => {
                            const next = selectedSlots.filter(x => !(x.memberId === s.memberId && x.date === s.date && x.startTime === s.startTime))
                            setSelectedSlots(next)
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
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
          multiSelect={true}
          onSelectionChange={handleSelectionChange}
          selectedSlots={selectedSlots}
        />
      )}
    </div>
  )
}