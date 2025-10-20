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

export async function createConsultaction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentApplicant = await getCurrentApplicantId()
  const result = demandSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
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

  try {
    await createDemand({
      organizationSlug: currentOrg!,
      unitSlug: currentUnit!,
      applicantSlug: currentApplicant!,
      title,
      description,
      // Dados de agendamento (se fornecidos)
      ...(memberId && { responsibleId: memberId }),
      ...(date && { scheduledDate: date }),
      ...(startTime && { scheduledTime: startTime }),
      // Dados de endereço (se fornecidos)
      street: street || null,
      complement: complement || null,
      number: number || null,
      neighborhood: neighborhood || null,
      zip_code: zip_code || null,
      state: state || null,
      city: city || null,
    })

    revalidateTag('demands')
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

  return {
    success: true,
    message: 'A consulta foi registrada com sucesso.',
    errors: null,
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
