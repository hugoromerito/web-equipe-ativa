export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'MANAGER', label: 'Recursos Humanos' },
  { value: 'CLERK', label: 'Atendente' },
  { value: 'ANALYST', label: 'Profissional de Saúde' },
  { value: 'BILLING', label: 'Faturista' },
]

export const translateRole = (value: string | undefined | null) => {
  if (!value) {
    return 'Sem cargo'
  }
  return ROLE_OPTIONS.find((opt) => opt.value === value)?.label || value
}
