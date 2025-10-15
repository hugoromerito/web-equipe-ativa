'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js/max'

import { createApplicant } from '@/http/create-applicant'
import { getCurrentOrg } from '@/lib/auth'
import { getCheckApplicant } from '@/http/get-check-applicant-slug'
import { isTituloEleitor } from 'validation-br'
const nameValidation = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length >= 4 && trimmed.split(' ').length > 1
}

const birthdateSchema = z
  .string()
  .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Formato de data inválido.',
  })
  .refine(
    (val) => {
      const [year, month, day] = val.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      )
    },
    {
      message: 'Data de nascimento inválida.',
    },
  )
  .transform((val) => new Date(val))

const nullableNameSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val === 'null') return null
    return val
  },
  z.union([
    z.string().refine(nameValidation, {
      message: 'Por favor, insira o nome completo.',
    }),
    z.null(),
  ]),
)

const nullableTicketSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val === 'null') return null
    return val
  },
  z.union([
    z.string().refine(isTituloEleitor, {
      message: 'Por favor, insira o título válido.',
    }),
    z.null(),
  ]),
)

const applicantSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Por favor, insira o nome completo.' })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, insira o nome completo.',
    }),
  birthdate: birthdateSchema,
  cpf: z.string().min(11, { message: 'Por favor, insira o CPF válido.' }),
  phone: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value, 'BR')
      return phoneNumber !== undefined && phoneNumber.isValid()
    },
    { message: 'Insira um número válido.' },
  ),
  mother: nullableNameSchema,
  father: nullableNameSchema,
  ticket: nullableTicketSchema,
  observation: z.string().nullable(),
  sus_card: z.string().nullable().optional(),
  zip_code: z
    .string()
    .min(1, { message: 'CEP é obrigatório.' })
    .transform((val) => val.replace(/\D/g, '')) // Remove tudo que não é dígito
    .refine((val) => val.length === 8, {
      message: 'CEP deve ter exatamente 8 dígitos.',
    }),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  numberNull: z.string().optional(), // Campo hidden para indicar se não tem número
}).superRefine((data, ctx) => {
  // Se zip_code foi preenchido, validar número/complemento
  if (data.zip_code && data.zip_code.length > 0) {
    // Se numberNull não for 'true', número é obrigatório
    if (data.numberNull !== 'true' && (!data.number || data.number.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O número é obrigatório quando há endereço. Marque "Sem número" se não houver.',
        path: ['number'],
      })
    }
    // Se numberNull for 'true', complemento é obrigatório
    if (data.numberNull === 'true' && (!data.complement || data.complement.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O complemento é obrigatório quando não há número do endereço.',
        path: ['complement'],
      })
    }
  }
})

type CreateApplicantState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
  applicantId?: string // <- opcional, mas estará presente no sucesso
}

export type ApplicantSchema = z.infer<typeof applicantSchema>

export async function createApplicantAction(
  data: FormData,
): Promise<CreateApplicantState> {
  const organizationSlug = data.get('organizationSlug') as string
  
  if (!organizationSlug) {
    return { 
      success: false, 
      message: 'Organização não identificada.', 
      errors: null 
    }
  }
  
  const result = applicantSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    name,
    birthdate,
    cpf,
    father,
    mother,
    observation,
    phone,
    ticket,
    sus_card,
    zip_code,
    state,
    city,
    street,
    neighborhood,
    complement,
    number,
  } = result.data

  try {
    const response = await createApplicant({
      organizationSlug,
      name,
      birthdate,
      cpf,
      father,
      mother,
      observation,
      phone,
      ticket,
      sus_card: sus_card || null,
      zip_code: zip_code || null,
      state: state || null,
      city: city || null,
      street: street || null,
      neighborhood: neighborhood || null,
      complement: complement || null,
      number: number || null,
    })

    revalidateTag('applicants')

    return {
      success: true,
      message: 'Solicitante cadastrado com sucesso.',
      errors: null,
      applicantId: response.applicantId,
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

export async function getCheckApplicantAction(data: FormData) {
  const cpfSchema = z.object({
    cpf: z.string().min(11, { message: 'CPF inválido.' }),
  })

  const organizationSlug = data.get('organizationSlug') as string
  
  if (!organizationSlug) {
    return { 
      success: false, 
      message: 'Organização não identificada.', 
      errors: null 
    }
  }
  
  const result = cpfSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { cpf } = result.data

  try {
    const response = await getCheckApplicant({
      organizationSlug,
      cpf,
    })

    // Se o applicant existe, retornar os dados
    if (response.exists && response.applicant) {
      return {
        success: true,
        applicant: response.applicant,
        message: null,
        errors: null,
      }
    }

    // Se não existe, retornar erro indicando que deve preencher o formulário
    return {
      success: false,
      message: 'CPF não encontrado. Preencha os dados do solicitante.',
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
