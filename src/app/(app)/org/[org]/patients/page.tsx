import { Header } from '@/components/header'
import { PatientsList } from './patients-list'

interface PageProps {
  params: Promise<{
    org: string
  }>
}

export default async function PatientsPage({ params }: PageProps) {
  const resolvedParams = await params
  const { org: organizationSlug } = resolvedParams

  return (
    <>
      <Header />
      <PatientsList organizationSlug={organizationSlug} />
    </>
  )
}