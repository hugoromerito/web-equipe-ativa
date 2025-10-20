'use client'

import { Briefcase, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MemberJobTitleBadgeProps {
  jobTitle?: {
    name: string
    workDays?: string[]
  }
}

const WEEK_DAYS_PT = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
}

export function MemberJobTitleBadge({ jobTitle }: MemberJobTitleBadgeProps) {
  if (!jobTitle) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Briefcase className="h-3 w-3 mr-1" />
        Sem cargo
      </Badge>
    )
  }

  const workDaysText = jobTitle.workDays
    ? jobTitle.workDays.map((day) => WEEK_DAYS_PT[day as keyof typeof WEEK_DAYS_PT]).join(', ')
    : 'Não definido'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className="cursor-help">
            <Briefcase className="h-3 w-3 mr-1" />
            {jobTitle.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{jobTitle.name}</p>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{workDaysText}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
