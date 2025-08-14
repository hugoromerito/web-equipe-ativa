'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleBack}
      className="mb-4 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar
    </Button>
  )
}