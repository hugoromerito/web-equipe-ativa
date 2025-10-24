// src/constants/demand-translations.ts

// Types baseados nos enums do backend
export type DemandStatusType = 'PENDING' | 'CHECK_IN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'BILLED'
export type DemandCategoryType = 'SOCIAL_WORKER' | 'PSYCHOMOTOR_PHYSIOTHERAPIST' | 'SPEECH_THERAPIST' | 'MUSIC_THERAPIST' | 'NEUROPSYCHOPEDAGOGUE' | 'NEUROPSYCHOLOGIST' | 'NUTRITIONIST' | 'PSYCHOLOGIST' | 'PSYCHOMOTRICIAN' | 'PSYCHOPEDAGOGUE' | 'THERAPIST' | 'OCCUPATIONAL_THERAPIST'
export type DemandPriorityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// Validação de transição de status
export const VALID_STATUS_TRANSITIONS: Record<DemandStatusType, DemandStatusType[]> = {
  PENDING: ['CHECK_IN', 'REJECTED'],
  CHECK_IN: ['IN_PROGRESS', 'PENDING', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED', 'CHECK_IN'],
  RESOLVED: ['BILLED', 'IN_PROGRESS'],
  REJECTED: ['PENDING', 'CHECK_IN'],
  BILLED: [], // Status final, não pode ser alterado
}

// Função para validar transição de status
export const canTransitionStatus = (currentStatus: DemandStatusType, newStatus: DemandStatusType): boolean => {
  return VALID_STATUS_TRANSITIONS[currentStatus].includes(newStatus)
}

// Função para obter próximos status possíveis
export const getNextPossibleStatuses = (currentStatus: DemandStatusType): DemandStatusType[] => {
  return VALID_STATUS_TRANSITIONS[currentStatus]
}

export const CATEGORY_OPTIONS = [
  { 
    value: 'SOCIAL_WORKER', 
    label: 'Assistente Social',
    icon: '🤝',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    description: 'Suporte social e orientação familiar'
  },
  { 
    value: 'PSYCHOMOTOR_PHYSIOTHERAPIST', 
    label: 'Fisioterapeuta Psicomotor',
    icon: '�',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-500',
    lightBg: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'Desenvolvimento motor e coordenação'
  },
  { 
    value: 'SPEECH_THERAPIST', 
    label: 'Fonoaudiólogo',
    icon: '🗣️',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Comunicação e linguagem'
  },
  { 
    value: 'MUSIC_THERAPIST', 
    label: 'Musicoterapeuta',
    icon: '🎵',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500',
    lightBg: 'bg-pink-50',
    textColor: 'text-pink-700',
    description: 'Terapia através da música'
  },
  { 
    value: 'NEUROPSYCHOPEDAGOGUE', 
    label: 'Neuropsicopedagogo',
    icon: '🧠',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    description: 'Aprendizagem e cognição'
  },
  { 
    value: 'NEUROPSYCHOLOGIST', 
    label: 'Neuropsicólogo',
    icon: '🧪',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-700',
    description: 'Avaliação neuropsicológica'
  },
  { 
    value: 'NUTRITIONIST', 
    label: 'Nutricionista',
    icon: '🥗',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700',
    description: 'Alimentação e nutrição'
  },
  { 
    value: 'PSYCHOLOGIST', 
    label: 'Psicólogo',
    icon: '�',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500',
    lightBg: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    description: 'Saúde mental e emocional'
  },
  { 
    value: 'PSYCHOMOTRICIAN', 
    label: 'Psicomotricista',
    icon: '🤸',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Desenvolvimento psicomotor'
  },
  { 
    value: 'PSYCHOPEDAGOGUE', 
    label: 'Psicopedagogo',
    icon: '📚',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Dificuldades de aprendizagem'
  },
  { 
    value: 'THERAPIST', 
    label: 'Terapeuta',
    icon: '🌟',
    color: 'from-fuchsia-500 to-fuchsia-600',
    bgColor: 'bg-fuchsia-500',
    lightBg: 'bg-fuchsia-50',
    textColor: 'text-fuchsia-700',
    description: 'Terapia geral'
  },
  { 
    value: 'OCCUPATIONAL_THERAPIST', 
    label: 'Terapeuta Ocupacional',
    icon: '✋',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: 'Autonomia e atividades diárias'
  },
]

export const PRIORITY_OPTIONS = [
  { 
    value: 'LOW', 
    label: 'Baixa',
    icon: '⬇️',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    textColor: 'text-gray-700',
    pulse: false
  },
  { 
    value: 'MEDIUM', 
    label: 'Média',
    icon: '➡️',
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    pulse: false
  },
  { 
    value: 'HIGH', 
    label: 'Alta',
    icon: '⬆️',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-700',
    pulse: true
  },
  { 
    value: 'URGENT', 
    label: 'Urgente',
    icon: '🚨',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    pulse: true
  },
]

export const STATUS_OPTIONS = [
  { 
    value: 'PENDING' as DemandStatusType, 
    label: 'Agendado',
    icon: '⏳',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: 'Aguardando atendimento'
  },
  { 
    value: 'CHECK_IN' as DemandStatusType, 
    label: 'Check-in',
    icon: '📋',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500',
    lightBg: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    description: 'Paciente realizou check-in'
  },
  { 
    value: 'IN_PROGRESS' as DemandStatusType, 
    label: 'Em Andamento',
    icon: '⚡',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Atendimento em progresso'
  },
  { 
    value: 'RESOLVED' as DemandStatusType, 
    label: 'Resolvida',
    icon: '✅',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: 'Atendimento concluído'
  },
  { 
    value: 'REJECTED' as DemandStatusType, 
    label: 'Faltou',
    icon: '❌',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Faltou à consulta'
  },
  { 
    value: 'BILLED' as DemandStatusType, 
    label: 'Faturada',
    icon: '💰',
    color: 'from-green-600 to-green-700',
    bgColor: 'bg-green-600',
    lightBg: 'bg-green-50',
    textColor: 'text-green-800',
    description: 'Consulta faturada'
  },
]

// Funções utilitárias
export const translateCategory = (value: string) =>
  CATEGORY_OPTIONS.find((opt) => opt.value === value) || {
    label: value,
    icon: '📋',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    textColor: 'text-gray-700'
  }

export const translatePriority = (value: string) =>
  PRIORITY_OPTIONS.find((opt) => opt.value === value) || {
    label: value,
    icon: '❓',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    textColor: 'text-gray-700',
    pulse: false
  }

export const translateStatus = (value: string) =>
  STATUS_OPTIONS.find((opt) => opt.value === value) || {
    label: value,
    icon: '❓',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    textColor: 'text-gray-700'
  }