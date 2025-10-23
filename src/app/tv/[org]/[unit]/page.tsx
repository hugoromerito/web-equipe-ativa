import { TVDisplayClient } from './tv-display-client'

export default async function TVDisplayPage({ 
  params 
}: { 
  params: Promise<{ org: string; unit: string }> 
}) {
  const { org, unit } = await params
  return <TVDisplayClient organizationSlug={org} unitSlug={unit} />
}
