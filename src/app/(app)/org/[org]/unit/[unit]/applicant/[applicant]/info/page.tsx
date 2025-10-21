import { Header } from '@/components/header'
import { getApplicant } from '@/http/get-applicant'
import { getCurrentOrg, getCurrentApplicantId } from '@/lib/auth'
import { ApplicantInfoView } from './applicant-info-view'

export default async function ApplicantInfoPage() {
  const currentOrg = await getCurrentOrg()
  const currentApplicant = await getCurrentApplicantId()

  let applicant = null
  let error = null

  try {
    applicant = await getApplicant({
      organizationSlug: currentOrg!,
      applicantSlug: currentApplicant!,
    })
  } catch (err) {
    console.error('❌ Erro ao carregar informações do paciente:', err)
    error = err instanceof Error ? err.message : 'Erro desconhecido'
  }

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <ApplicantInfoView 
          applicant={applicant} 
          error={error}
          currentOrg={currentOrg!}
          currentApplicant={currentApplicant!}
        />
      </div>
    </>
  )
}
