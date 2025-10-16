import { getCurrentApplicant, getCurrentOrg, getCurrentUnit } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function ApplicantName() {
  const applicant = await getCurrentApplicant()
  const unitSlug = await getCurrentUnit()
  const organizationSlug = await getCurrentOrg()

  if (!applicant) {
    redirect(`/org/${organizationSlug}/unit/${unitSlug}/applicant`)
  }
  const currentApplicant = applicant

  function formatBirthdate(value: string | undefined) {
    if (!value) return 'Não informada'
    
    try {
      // Tenta criar um objeto Date a partir do valor
      const date = new Date(value)
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        // Se não for uma data válida, tenta extrair números e formatar
        const digits = value.replace(/\D/g, '').slice(0, 8)
        if (digits.length === 8) {
          const year = digits.slice(0, 4)
          const month = digits.slice(4, 6)
          const day = digits.slice(6, 8)
          return `${day}/${month}/${year}`
        }
        return value // Retorna original se não conseguir formatar
      }
      
      // Formata a data válida em DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error('Erro ao formatar data de nascimento:', error)
      return value // Retorna valor original em caso de erro
    }
  }

  return (
    <div className="flex flex-col pb-2">
      <h2 className="font-medium">Paciente</h2>
      <span className="text-left text-sm">Nome: {currentApplicant.name}</span>
      <span className="text-left text-sm">
        Data de nascimento: {formatBirthdate(currentApplicant.birthdate)}
      </span>
    </div>
  )
}
