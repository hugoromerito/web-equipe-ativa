import { Header } from '@/components/header'
import { AssignJobTitleForm } from './assign-job-title-form'
import { api } from '@/http/api-client'

interface PageProps {
  params: Promise<{
    org: string
    member: string
  }>
}

interface MemberResponse {
  member: {
    id: string
    user: {
      id: string
      name: string | null
      email: string
      avatar_url: string | null
    }
  }
}

async function getMember(organizationSlug: string, memberId: string) {
  try {
    const result = await api
      .get(`organizations/${organizationSlug}/members/${memberId}`)
      .json<MemberResponse>()
    return result.member
  } catch (error) {
    console.error('Error fetching member:', error)
    return null
  }
}

export default async function AssignJobTitlePage({ params }: PageProps) {
  const resolvedParams = await params
  const { org: organizationSlug, member: memberId } = resolvedParams

  const memberData = await getMember(organizationSlug, memberId)

  if (!memberData) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Membro não encontrado
          </h1>
          <p className="text-muted-foreground mt-2">
            O membro solicitado não existe ou você não tem permissão para acessá-lo.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <AssignJobTitleForm
        organizationSlug={organizationSlug}
        memberId={memberId}
        memberData={{
          name: memberData.user.name,
          email: memberData.user.email,
          avatarUrl: memberData.user.avatar_url,
        }}
      />
    </>
  )
}
