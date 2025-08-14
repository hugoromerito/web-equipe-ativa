// src/constants/demand-translations.ts

export const CATEGORY_OPTIONS = [
  { 
    value: 'INFRASTRUCTURE', 
    label: 'Infraestrutura e Serviços Públicos',
    icon: '🏗️',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Obras, pavimentação, saneamento'
  },
  { 
    value: 'HEALTH', 
    label: 'Saúde Pública',
    icon: '🏥',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Hospitais, postos de saúde, medicamentos'
  },
  { 
    value: 'EDUCATION', 
    label: 'Educação e Creches',
    icon: '🎓',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Escolas, creches, material escolar'
  },
  { 
    value: 'SOCIAL_ASSISTANCE', 
    label: 'Assistência Social',
    icon: '🤝',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    description: 'Programas sociais, assistência'
  },
  { 
    value: 'PUBLIC_SAFETY', 
    label: 'Segurança Pública',
    icon: '🛡️',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Policiamento, iluminação, câmeras'
  },
  { 
    value: 'TRANSPORTATION', 
    label: 'Transporte e Mobilidade',
    icon: '🚌',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700',
    description: 'Ônibus, ciclovias, acessibilidade'
  },
  { 
    value: 'EMPLOYMENT', 
    label: 'Emprego e Desenvolvimento Econômico',
    icon: '💼',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    description: 'Capacitação, empreendedorismo'
  },
  { 
    value: 'CULTURE', 
    label: 'Cultura, Esporte e Lazer',
    icon: '🎭',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500',
    lightBg: 'bg-pink-50',
    textColor: 'text-pink-700',
    description: 'Eventos, esportes, centros culturais'
  },
  { 
    value: 'ENVIRONMENT', 
    label: 'Meio Ambiente e Sustentabilidade',
    icon: '🌱',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: 'Limpeza, reciclagem, arborização'
  },
  { 
    value: 'HUMAN_RIGHTS', 
    label: 'Direitos Humanos e Cidadania',
    icon: '⚖️',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-700',
    description: 'Igualdade, inclusão, cidadania'
  },
  { 
    value: 'TECHNOLOGY', 
    label: 'Tecnologia e Inovação',
    icon: '💻',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500',
    lightBg: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    description: 'Internet, digitalização, inovação'
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
    value: 'PENDING', 
    label: 'Aguardando atendimento',
    icon: '⏳',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700'
  },
  { 
    value: 'IN_PROGRESS', 
    label: 'Em andamento',
    icon: '⚡',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  { 
    value: 'RESOLVED', 
    label: 'Resolvida',
    icon: '✅',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700'
  },
  { 
    value: 'REJECTED', 
    label: 'Rejeitada',
    icon: '❌',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700'
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