'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, Filter, Calendar, MapPin, User, ChevronRight, 
  Grid, List, Sparkles, TrendingUp, ChevronLeft
} from 'lucide-react'
import { 
  translateCategory, 
  translatePriority, 
  translateStatus,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS 
} from '@/constants/demand-translations'
import { BadgeDemand } from '@/components/badge-demand'
import Link from 'next/link'

// Types
interface Demand {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: string
  author: string
  location: string
  urgency: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

interface DemandListProps {
  currentOrg?: string
  currentUnit?: string
  demands: Demand[]
  pagination: Pagination
  initialSearchParams: Record<string, string | undefined>
}

export function DemandList({ 
  currentOrg, 
  currentUnit, 
  demands, 
  pagination,
  initialSearchParams 
}: DemandListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados do filtro - inicializados com os parâmetros da URL
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || '')
  const [filterCategory, setFilterCategory] = useState(initialSearchParams.category || '')
  const [filterStatus, setFilterStatus] = useState(initialSearchParams.status || '')
  const [filterPriority, setFilterPriority] = useState(initialSearchParams.priority || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'priority' | 'status'>(
    initialSearchParams.sort_by as any || 'created_at'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialSearchParams.sort_order as any || 'desc'
  )
  const [isLoading, setIsLoading] = useState(false)

  // Função para atualizar a URL com os novos parâmetros
  const updateURL = useCallback((newParams: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString())
    
    // Atualizar ou remover parâmetros
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    // Sempre resetar para página 1 quando houver mudança de filtros (exceto mudança de página)
    if (!newParams.page) {
      current.set('page', '1')
    }

    const newURL = `${window.location.pathname}?${current.toString()}`
    router.push(newURL)
  }, [router, searchParams])

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialSearchParams.search) {
        updateURL({ search: searchTerm })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, updateURL, initialSearchParams.search])

  // Handlers para mudanças de filtro
  const handleCategoryChange = (category: string) => {
    setFilterCategory(category)
    updateURL({ category })
  }

  const handleStatusChange = (status: string) => {
    setFilterStatus(status)
    updateURL({ status })
  }

  const handlePriorityChange = (priority: string) => {
    setFilterPriority(priority)
    updateURL({ priority })
  }

  const handleSortChange = (sort_by: string, sort_order?: string) => {
    setSortBy(sort_by as any)
    if (sort_order) {
      setSortOrder(sort_order as any)
    }
    updateURL({ 
      sort_by, 
      sort_order: sort_order || sortOrder 
    })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 90) return 'text-red-500'
    if (urgency >= 70) return 'text-orange-500'
    if (urgency >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  // Prioridade de ordenação para exibição local
  const PRIORITY_ORDER = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  const STATUS_ORDER = { 'PENDING': 1, 'IN_PROGRESS': 2, 'RESOLVED': 3, 'CANCELED': 4 }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-1/4" />
            <div className="h-24 bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-56 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="medical-layout min-h-screen">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Médico Clean */}
        <div className="medical-section">
          <h1 className="medical-section-title">
            Central de Demandas
          </h1>
          
          <p className="medical-section-subtitle">
            Gerencie e acompanhe todas as demandas médicas do setor
          </p>

          {/* Stats Cards Médicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            <div className="medical-card medical-stat">
              <div className="text-xs text-slate-500 mb-1">Total de Demandas</div>
              <div className="medical-stat-value text-blue-600">{pagination.total}</div>
            </div>
            <div className="medical-card medical-stat">
              <div className="text-xs text-slate-500 mb-1">Resolvidas</div>
              <div className="medical-stat-value text-emerald-600">
                {demands.filter(d => d.status === 'RESOLVED').length}
              </div>
            </div>
            <div className="medical-card medical-stat">
              <div className="text-xs text-slate-500 mb-1">Em Andamento</div>
              <div className="medical-stat-value text-blue-600">
                {demands.filter(d => d.status === 'IN_PROGRESS').length}
              </div>
            </div>
            <div className="medical-card medical-stat">
              <div className="text-xs text-slate-500 mb-1">Pendentes</div>
              <div className="medical-stat-value text-amber-600">
                {demands.filter(d => d.status === 'PENDING').length}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Design Médico */}
        <div className="medical-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Medical */}
            <div className="flex-1 medical-search">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar demandas por título, descrição ou paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="medical-input"
              />
            </div>

            {/* Controls Médicos */}
            <div className="flex flex-wrap gap-3">
              {/* Sort Médico */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('-')
                  handleSortChange(sort_by, sort_order)
                }}
                className="medical-input min-w-[160px]"
              >
                <option value="created_at-desc">Mais Recentes</option>
                <option value="created_at-asc">Mais Antigas</option>
                <option value="priority-desc">Prioridade Alta</option>
                <option value="priority-asc">Prioridade Baixa</option>
                <option value="status-asc">Status A-Z</option>
                <option value="updated_at-desc">Recém Atualizadas</option>
              </select>

              {/* View Mode Médico */}
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filter Toggle Médico */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                }`}
              >
                <Filter size={20} />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Extended Filters Médicos */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-4 medical-fade-in">
              <select
                value={filterCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="medical-input min-w-[200px]"
              >
                <option value="">Todas as especialidades</option>
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="medical-input min-w-[180px]"
              >
                <option value="">Todos os status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="medical-input min-w-[180px]"
              >
                <option value="">Todas as prioridades</option>
                <option value="URGENT">🔴 Urgente</option>
                <option value="HIGH">🟠 Alta</option>
                <option value="MEDIUM">🟡 Média</option>
                <option value="LOW">🟢 Baixa</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Header Médico */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {demands.length} demanda{demands.length !== 1 ? 's' : ''} 
              {pagination.total > demands.length && (
                <span className="text-slate-500 text-base"> de {pagination.total}</span>
              )}
            </h2>
            {demands.length > 0 && (
              <div className="status-indicator status-progress">
                <span>Página {pagination.page}</span>
              </div>
            )}
          </div>
        </div>

        {/* Demands Grid/List - Design Médico */}
        {demands.length === 0 ? (
          <div className="text-center py-16">
            <div className="medical-card p-12 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Nenhuma demanda encontrada
              </h3>
              <p className="text-slate-600 mb-6">
                Tente ajustar os filtros ou criar uma nova demanda médica.
              </p>
              <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
                <button className="btn-medical">
                  Criar Nova Demanda
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
            }`}>
              {demands.map((demand, index) => {
                const category = translateCategory(demand.category)
                const priority = translatePriority(demand.priority)
                const status = translateStatus(demand.status)

                return (
                  <div
                    key={demand.id}
                    className="medical-card group p-6 hover:shadow-lg transition-all duration-300 medical-fade-in border-l-4 border-l-blue-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link href={`/org/${currentOrg}/unit/${currentUnit}/demands/${demand.id}`}>
                    
                    {/* Header Médico */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-lg`}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                              {demand.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {category.label}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Urgency Indicator */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getUrgencyColor(demand.urgency).replace('text-', 'bg-')}`} />
                        <ChevronRight className="text-slate-400 group-hover:text-blue-500 transition-colors" size={20} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {demand.description}
                    </p>

                    {/* Status Badges Médicos */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`status-indicator ${
                        demand.status === 'PENDING' ? 'status-pending' :
                        demand.status === 'IN_PROGRESS' ? 'status-progress' :
                        demand.status === 'RESOLVED' ? 'status-resolved' :
                        'status-pending'
                      }`}>
                        {status.label}
                      </span>
                      
                      <span className={`status-indicator ${
                        demand.priority === 'URGENT' ? 'status-urgent' :
                        demand.priority === 'HIGH' ? 'status-pending' :
                        'status-progress'
                      }`}>
                        {priority.label}
                      </span>
                    </div>

                    {/* Location Médica */}
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-4 p-2 bg-slate-50 rounded-lg">
                      <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">{demand.location}</span>
                    </div>

                    {/* Footer Stats Médicos */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span className="font-medium">{demand.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(demand.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Pagination Médica */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    pagination.has_prev
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-50 bg-white'
                      : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  }`}
                >
                  <ChevronLeft size={18} />
                  <span>Anterior</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                    let pageNum: number
                    
                    if (pagination.total_pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.total_pages - 2) {
                      pageNum = pagination.total_pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }

                    const isCurrentPage = pageNum === pagination.page

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${
                          isCurrentPage
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    pagination.has_next
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-50 bg-white'
                      : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  }`}
                >
                  <span>Próxima</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-4">
              <p className="text-slate-500 text-sm">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} demandas
              </p>
            </div>
          </>
        )}

        {/* Create New Demand Button - Design Médico */}
        <div className="text-center mt-10">
          <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
            <button className="btn-medical flex items-center gap-2 mx-auto">
              <Sparkles className="w-5 h-5" />
              Criar Nova Demanda Médica
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}