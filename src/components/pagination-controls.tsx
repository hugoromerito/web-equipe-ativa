'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  totalItems?: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  totalItems,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        {totalItems !== undefined && (
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'itens'} no total
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
