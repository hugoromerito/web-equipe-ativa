import { Header } from '@/components/header'
import { JobTitlesList } from './job-titles-list'

interface PageProps {
  params: Promise<{
    org: string
  }>
}

export default async function JobTitlesPage({ params }: PageProps) {
  const resolvedParams = await params
  const { org: organizationSlug } = resolvedParams

  return (
    <>
      <Header />
      <JobTitlesList organizationSlug={organizationSlug} />
    </>
  )
}
