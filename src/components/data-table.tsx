'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react'

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: (item: T) => React.ReactNode
    className?: string
  }[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
  onPageChange?: (page: number) => void
  onSearch?: (search: string) => void
  searchPlaceholder?: string
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Buscar...',
  loading = false,
  emptyMessage = 'Nenhum resultado encontrado.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  return (
    <div className="space-y-6">
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 medical-form-input"
          />
        </div>
      )}

      <div className="medical-card overflow-hidden">
        <Table variant="medical">
          <TableHeader>
            <TableRow className="border-b-2 border-border/60">
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  className={`${column.className} bg-muted/30 font-semibold text-muted-foreground py-4`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="medical-skeleton w-8 h-8 rounded-full"></div>
                    <span className="text-muted-foreground">Carregando dados médicos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground font-medium">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow 
                  key={index} 
                  className="hover:bg-muted/30 transition-colors border-b border-border/30"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      className={`${column.className} py-4 text-foreground`}
                    >
                      {column.accessor(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="medical-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground font-medium">
              Página <span className="text-foreground font-semibold">{pagination.page}</span> de{' '}
              <span className="text-foreground font-semibold">{pagination.total_pages}</span> • Total:{' '}
              <span className="text-primary font-semibold">{pagination.total}</span> registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(1)}
                disabled={!pagination.has_prev}
                className="p-2"
              >
                <ChevronsLeft size={16} />
                <span className="sr-only">Primeira página</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="p-2"
              >
                <ChevronLeft size={16} />
                <span className="sr-only">Página anterior</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="p-2"
              >
                <ChevronRight size={16} />
                <span className="sr-only">Próxima página</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.total_pages)}
                disabled={!pagination.has_next}
                className="p-2"
              >
                <ChevronsRight size={16} />
                <span className="sr-only">Última página</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
