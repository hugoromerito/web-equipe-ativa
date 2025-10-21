'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { createDemand } from '@/http/create-demand'
import {
  getCurrentApplicantId,
  getCurrentOrg,
  getCurrentUnit,
} from '@/lib/auth'
import { getApplicant } from '@/http/get-applicant'
import { applicantSchema } from '@/lib/auth/models/applicant'

const demandSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'Por favor, inclua o título da consulta.' }),
  description: z
    .string()
    .min(10, { message: 'Por favor, detalhe a solicitação.' }),
  // Dados de agendamento (novos campos)
  memberId: z.string().optional(),
  date: z.string().optional(), // yyyy-MM-dd
  startTime: z.string().optional(), // HH:mm
  endTime: z.string().optional(), // HH:mm
  // Campos de endereço (opcionais/removidos)
  street: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  zip_code: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
})

export type DemandSchema = z.infer<typeof demandSchema>

// Tipo para o resultado de cada slot
export interface SlotResult {
  slot: string // Descrição legível do slot (ex: "21/10 às 09:00 - Dr. João")
  success: boolean
  error?: string
  date?: string
  time?: string
  memberName?: string
}

export async function createConsultaction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentApplicant = await getCurrentApplicantId()
  const result = demandSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors, results: [] }
  }

  const {
    title,
    description,
    memberId,
    date,
    startTime,
    endTime,
    street,
    complement,
    number,
    neighborhood,
    zip_code,
    state,
    city,
  } = result.data

  // Batch create when slots[] present in form data
  const slots: { memberId?: string; date?: string; startTime?: string; endTime?: string; memberName?: string }[] = []
  // FormData fields come as slots[0][memberId], etc. Parse them
  for (const [key, value] of (data as any).entries()) {
    const match = key.match(/^slots\[(\d+)\]\[(.+)\]$/)
    if (match) {
      const idx = Number(match[1])
      const field = match[2]
      const allowedFields = ['memberId', 'date', 'startTime', 'endTime', 'memberName'] as const
      if (!allowedFields.includes(field as any)) continue
      slots[idx] = slots[idx] || {}
      ;(slots[idx] as any)[field] = value as string
    }
  }

  const results: SlotResult[] = []

  try {
    if (slots.length > 0) {
      // Create demands for each slot and track results
      for (const s of slots) {
        const slotDescription = `${s.date ? new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não informada'} às ${s.startTime || 'Horário não informado'}${s.memberName ? ` - ${s.memberName}` : ''}`
        
        try {
          await createDemand({
            organizationSlug: currentOrg!,
            unitSlug: currentUnit!,
            applicantSlug: currentApplicant!,
            title,
            description,
            ...(s.memberId && { responsibleId: s.memberId }),
            ...(s.date && { scheduledDate: s.date }),
            ...(s.startTime && { scheduledTime: s.startTime }),
            street: street || null,
            complement: complement || null,
            number: number || null,
            neighborhood: neighborhood || null,
            zip_code: zip_code || null,
            state: state || null,
            city: city || null,
          })
          
          results.push({
            slot: slotDescription,
            success: true,
            date: s.date,
            time: s.startTime,
            memberName: s.memberName,
          })
        } catch (slotErr) {
          let errorMessage = 'Erro ao criar consulta'
          if (slotErr instanceof HTTPError) {
            try {
              const { message } = await slotErr.response.json()
              errorMessage = message
            } catch {
              errorMessage = 'Erro de comunicação com servidor'
            }
          }
          
          results.push({
            slot: slotDescription,
            success: false,
            error: errorMessage,
            date: s.date,
            time: s.startTime,
            memberName: s.memberName,
          })
        }
      }

      revalidateTag('demands')

      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      if (failCount === 0) {
        return {
          success: true,
          message: `Todas as ${successCount} consultas foram criadas com sucesso! 🎉`,
          errors: null,
          results,
        }
      } else if (successCount === 0) {
        return {
          success: false,
          message: `Nenhuma consulta foi criada. ${failCount} erro(s) encontrado(s).`,
          errors: null,
          results,
        }
      } else {
        return {
          success: true,
          message: `${successCount} de ${slots.length} consultas criadas com sucesso. ${failCount} falharam.`,
          errors: null,
          results,
        }
      }
    } else {
      // Single demand creation (backward compatibility)
      await createDemand({
        organizationSlug: currentOrg!,
        unitSlug: currentUnit!,
        applicantSlug: currentApplicant!,
        title,
        description,
        ...(memberId && { responsibleId: memberId }),
        ...(date && { scheduledDate: date }),
        ...(startTime && { scheduledTime: startTime }),
        street: street || null,
        complement: complement || null,
        number: number || null,
        neighborhood: neighborhood || null,
        zip_code: zip_code || null,
        state: state || null,
        city: city || null,
      })

      revalidateTag('demands')

      return {
        success: true,
        message: 'A consulta foi registrada com sucesso.',
        errors: null,
        results: [],
      }
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null, results }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
      results,
    }
  }
}

export async function getApplicantAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentApplicant = await getCurrentApplicantId()
  const result = applicantSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const {} = result.data // Extrair CPF do schema
  try {
    const applicant = await getApplicant({
      organizationSlug: currentOrg!,
      applicantSlug: currentApplicant!,
    })

    // Retorna somente name e birthdate, como você deseja
    return {
      success: true,
      applicant: {
        name: applicant.name,
        birthdate: applicant.birthdate,
      },
      message: null,
      errors: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)
    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }
}
