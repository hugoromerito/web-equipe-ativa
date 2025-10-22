import { TVDisplayClient } from './tv-display-client'

export default function TVDisplayPage({ 
  params 
}: { 
  params: { org: string; unit: string } 
}) {
  return <TVDisplayClient organizationSlug={params.org} unitSlug={params.unit} />
}
