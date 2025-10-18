import { Header } from '@/components/header'
import { ApplicantForm } from './create-applicant-form'
import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'

export default async function CreateDemandPage() {
  const org = await getCurrentOrg()
  const unit = await getCurrentUnit()
  return (
    <>
      <Header />
      <main>
        <ApplicantForm organizationSlug={org} unitSlug={unit} />
      </main>
    </>
  )
}
