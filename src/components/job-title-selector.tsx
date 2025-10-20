'use client'

import { useState } from 'react'
import { Briefcase, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { JobTitle } from '@/http/get-job-titles'

interface JobTitleSelectorProps {
  jobTitles: JobTitle[]
  selectedJobTitleId: string | null
  onJobTitleSelect: (jobTitleId: string | null) => void
  isLoading?: boolean
}

export function JobTitleSelector({
  jobTitles,
  selectedJobTitleId,
  onJobTitleSelect,
  isLoading = false,
}: JobTitleSelectorProps) {
  const handleCheckboxChange = (jobTitleId: string, checked: boolean) => {
    if (checked) {
      onJobTitleSelect(jobTitleId)
    } else {
      onJobTitleSelect(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>Selecionar Cargo</CardTitle>
              <CardDescription>
                Escolha o cargo para visualizar disponibilidade
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (jobTitles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>Selecionar Cargo</CardTitle>
              <CardDescription>
                Escolha o cargo para visualizar disponibilidade
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Nenhum cargo disponível. Cadastre cargos primeiro.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle>Selecionar Cargo</CardTitle>
            <CardDescription>
              Escolha o cargo para visualizar disponibilidade dos profissionais
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobTitles.map((jobTitle) => (
            <div
              key={jobTitle.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={`job-title-${jobTitle.id}`}
                checked={selectedJobTitleId === jobTitle.id}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(jobTitle.id, checked as boolean)
                }
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`job-title-${jobTitle.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {jobTitle.name}
                </Label>
                {jobTitle.description && (
                  <p className="text-xs text-muted-foreground">
                    {jobTitle.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
