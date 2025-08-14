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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-2xl w-1/3" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-5 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Sistema de Demandas Públicas</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Demandas da Comunidade
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Acompanhe, gerencie e participe das demandas que transformam nossa cidade. 
            Sua voz importa para construir um futuro melhor.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
              <div className="text-sm text-gray-600">Total de Demandas</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="text-2xl font-bold text-green-600">
                {demands.filter(d => d.status === 'RESOLVED').length}
              </div>
              <div className="text-sm text-gray-600">Resolvidas</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="text-2xl font-bold text-blue-600">
                {demands.filter(d => d.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Buscar demandas por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('-')
                  handleSortChange(sort_by, sort_order)
                }}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all min-w-[140px]"
              >
                <option value="created_at-desc">Mais Recentes</option>
                <option value="created_at-asc">Mais Antigas</option>
                <option value="priority-desc">Prioridade Alta</option>
                <option value="priority-asc">Prioridade Baixa</option>
                <option value="status-asc">Status A-Z</option>
                <option value="updated_at-desc">Recém Atualizadas</option>
              </select>

              {/* View Mode */}
              <div className="flex rounded-2xl border-2 border-gray-200 overflow-hidden bg-white/50 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                  showFilters 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white/50 backdrop-blur-sm'
                }`}
              >
                <Filter size={20} />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 animate-in slide-in-from-top duration-300">
              <select
                value={filterCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all min-w-[200px]"
              >
                <option value="">Todas as categorias</option>
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all min-w-[180px]"
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
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all min-w-[180px]"
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {demands.length} demanda{demands.length !== 1 ? 's' : ''} 
              {pagination.total > demands.length && (
                <span className="text-gray-500 text-lg"> de {pagination.total}</span>
              )}
            </h2>
            {demands.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>Página {pagination.page}</span>
              </div>
            )}
          </div>
        </div>

        {/* Demands Grid/List */}
        {demands.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhuma demanda encontrada
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Tente ajustar os filtros de busca ou criar uma nova demanda para a comunidade.
            </p>
            <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                Criar Nova Demanda
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid gap-8 ${viewMode === 'grid' 
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
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link href={`/org/${currentOrg}/unit/${currentUnit}/demands/${demand.id}`}>
                    
                    {/* Urgency Indicator */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(demand.urgency).replace('text-', 'bg-')} animate-pulse`} />
                    </div>

                    {/* Category Banner */}
                    <div className={`h-2 bg-gradient-to-r ${category.color}`} />

                    {/* Card Content */}
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                              {category.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                                {demand.title}
                              </h3>
                              <p className="text-sm text-gray-500 font-medium">
                                {category.label}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                            {demand.description}
                          </p>
                        </div>
                        
                        <ChevronRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 ml-4 flex-shrink-0" size={24} />
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <BadgeDemand status={demand.status} size="md" animated>
                          <div className="flex items-center gap-1">
                            {status.label}
                          </div>
                        </BadgeDemand>
                        
                        <BadgeDemand priority={demand.priority} size="md" animated>
                          <div className="flex items-center gap-1">
                            {priority.label}
                          </div>
                        </BadgeDemand>
                        
                        {demand.urgency >= 80 && (
                          <BadgeDemand variant="outline" size="md" className="border-red-300 text-red-600 animate-pulse">
                            <div className="flex items-center gap-1">
                              Crítico
                            </div>
                          </BadgeDemand>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-500 mb-6 p-3 bg-gray-50 rounded-xl">
                        <MapPin size={18} className="flex-shrink-0 text-blue-500" />
                        <span className="text-sm font-medium truncate">{demand.location}</span>
                      </div>

                      {/* Footer Stats */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                            <User size={16} />
                            <span className="font-medium">{demand.author}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>{formatDate(demand.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -skew-x-12 translate-x-full opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine group-hover:opacity-100 transition-opacity duration-700" />
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    pagination.has_prev
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Anterior</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
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
                        className={`w-12 h-12 rounded-2xl border-2 font-bold transition-all duration-300 ${
                          isCurrentPage
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-110'
                            : 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 bg-white/80 backdrop-blur-sm'
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    pagination.has_next
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <span>Próxima</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} demandas
              </p>
            </div>
          </>
        )}

        {/* Create New Demand Button - Always visible */}
        <div className="text-center mt-12">
          <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
            <button className="group px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-500 transform hover:scale-105 shadow-xl font-medium text-lg relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Criar Nova Demanda
              </span>
              
              {/* Button shine effect */}
              <div className="absolute inset-0 -skew-x-12 translate-x-full opacity-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine group-hover:opacity-100 transition-opacity duration-700" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}