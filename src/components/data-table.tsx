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
        <div className="medical-search">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="medical-input"
          />
        </div>
      )}

      <div className="medical-table">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-100">
              {columns.map((column, index) => (
                <TableHead key={index} className={`${column.className} bg-slate-50 font-semibold text-slate-700 py-4`}>
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
                    <span className="text-slate-500">Carregando dados médicos...</span>
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
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className="text-slate-500 font-medium">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={`${column.className} py-4 text-slate-700`}>
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 font-medium">
            Página {pagination.page} de {pagination.total_pages} • Total:{' '}
            {pagination.total} registros
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(1)}
              disabled={!pagination.has_prev}
              className="btn-medical-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={!pagination.has_prev}
              className="btn-medical-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={!pagination.has_next}
              className="btn-medical-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.total_pages)}
              disabled={!pagination.has_next}
              className="btn-medical-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
