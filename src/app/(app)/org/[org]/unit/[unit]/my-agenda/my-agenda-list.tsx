'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, Filter, Calendar, User, ChevronRight, 
  Grid, List, Sparkles, TrendingUp, ChevronLeft, ChevronDown, Clock, CalendarCheck
} from 'lucide-react'
import { 
  translateCategory, 
  translatePriority, 
  translateStatus,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS 
} from '@/constants/demand-translations'
import { formatLocalDate, formatTime } from '@/utils/date-utils'
import Link from 'next/link'
import type { MyDemand, MyDemandsPagination } from '@/http/get-my-demands'
import { QuickStatusActions } from './quick-status-actions'

interface MyAgendaProps {
  currentOrg: string
  currentUnit: string
  demands: MyDemand[]
  pagination: MyDemandsPagination
  initialSearchParams: Record<string, string | undefined>
}

export function MyAgenda({ 
  currentOrg, 
  currentUnit, 
  demands, 
  pagination,
  initialSearchParams 
}: MyAgendaProps) {
  const router = useRouter()
  
  const initialParamsRef = useRef(initialSearchParams)
  
  const [searchTerm, setSearchTerm] = useState(initialParamsRef.current.search || '')
  const [filterCategory, setFilterCategory] = useState(initialParamsRef.current.category || '')
  const [filterStatus, setFilterStatus] = useState(initialParamsRef.current.status || '')
  const [filterPriority, setFilterPriority] = useState(initialParamsRef.current.priority || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string | undefined>(initialParamsRef.current.sort_by)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
    initialParamsRef.current.sort_order as any
  )
  
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    initialParamsRef.current = initialSearchParams
  }, [initialSearchParams])

  const updateURL = useCallback((newParams: Record<string, string | undefined>) => {
    if (isNavigatingRef.current) return
    
    isNavigatingRef.current = true
    const current = new URLSearchParams(window.location.search)
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })

    if (!newParams.page) {
      current.set('page', '1')
    }

    const newURL = `${window.location.pathname}?${current.toString()}`
    router.push(newURL, { scroll: false })
    
    setTimeout(() => {
      isNavigatingRef.current = false
    }, 100)
  }, [router])

  useEffect(() => {
    const initialSearch = initialParamsRef.current.search || ''
    const currentSearchTrimmed = searchTerm.trim()
    
    if (currentSearchTrimmed === initialSearch) return

    const timer = setTimeout(() => {
      updateURL({ search: currentSearchTrimmed || undefined })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, updateURL])

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
    setSortBy(sort_by)
    if (sort_order) {
      setSortOrder(sort_order as 'asc' | 'desc')
    }
    updateURL({ 
      sort_by, 
      sort_order: sort_order || sortOrder || undefined
    })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() })
  }

  // Contar demandas por status
  const pendingCount = demands.filter(d => d.status === 'PENDING').length
  const checkInCount = demands.filter(d => d.status === 'CHECK_IN').length
  const inProgressCount = demands.filter(d => d.status === 'IN_PROGRESS').length
  const resolvedCount = demands.filter(d => d.status === 'RESOLVED').length

  // Contar demandas agendadas para hoje
  const today = new Date().toISOString().split('T')[0]
  const todayDemandsCount = demands.filter(d => d.scheduled_date === today).length

  return (
    <div className="medical-layout min-h-screen">
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="medical-section">
          <h1 className="medical-section-title text-2xl sm:text-3xl flex items-center gap-3">
            <CalendarCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            Minha Agenda
          </h1>
          
          <p className="medical-section-subtitle text-sm sm:text-base">
            Visualize e gerencie suas demandas atribuídas
          </p>

          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 my-4 sm:my-6">
            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 group-hover:from-blue-500/10 group-hover:to-blue-600/20 transition-all"></div>
              <div className="relative p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Total</div>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{pagination.total}</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 group-hover:from-purple-500/10 group-hover:to-purple-600/20 transition-all"></div>
              <div className="relative p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 animate-pulse"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Hoje</div>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{todayDemandsCount}</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 group-hover:from-amber-500/10 group-hover:to-amber-600/20 transition-all"></div>
              <div className="relative p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Pendentes</div>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{pendingCount}</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 group-hover:from-blue-500/10 group-hover:to-blue-600/20 transition-all"></div>
              <div className="relative p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                    <List className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Andamento</div>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{inProgressCount}</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 group-hover:from-emerald-500/10 group-hover:to-emerald-600/20 transition-all"></div>
              <div className="relative p-3 sm:p-5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Resolvidas</div>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{resolvedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 p-3 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
            {/* Search Box */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar em minha agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Sort Dropdown */}
              <div className="relative group flex-1 sm:flex-initial">
                <select
                  value={`${sortBy || 'scheduled_datetime'}-${sortOrder || 'asc'}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split('-')
                    handleSortChange(sort_by, sort_order)
                  }}
                  className="appearance-none w-full pl-3 sm:pl-4 pr-9 sm:pr-10 py-2.5 sm:py-3 sm:min-w-[200px] bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200"
                >
                  <option value="scheduled_datetime-asc">📅 Próximos agendamentos</option>
                  <option value="scheduled_datetime-desc">⏰ Últimos agendamentos</option>
                  <option value="created_at-desc">🕐 Recentes</option>
                  <option value="created_at-asc">⏰ Antigas</option>
                  <option value="priority-desc">⚡ Alta Prioridade</option>
                  <option value="status-asc">✓ Status A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-md shadow-primary/20' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-700'
                  }`}
                  title="Visualização em Lista"
                >
                  <List size={18} className="sm:w-5 sm:h-5" />
                </button>
                <div className="w-px bg-slate-200"></div>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-700'
                  }`}
                  title="Visualização em Grade"
                >
                  <Grid size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-200 font-medium text-xs sm:text-sm ${
                  showFilters 
                    ? 'bg-gradient-to-br from-primary to-primary/90 text-white border-primary shadow-md shadow-primary/20' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:shadow-sm hover:border-slate-300'
                }`}
              >
                <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
                <span className="sm:hidden">{showFilters ? 'Ocultar' : 'Filtros'}</span>
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px] relative group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Especialidade
                  </label>
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:from-white focus:to-white transition-all duration-200"
                    >
                      <option value="">🏥 Todas as especialidades</option>
                      {CATEGORY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex-1 min-w-[180px] relative group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:from-white focus:to-white transition-all duration-200"
                    >
                      <option value="">📋 Todos os status</option>
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="flex-1 min-w-[180px] relative group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Prioridade
                  </label>
                  <div className="relative">
                    <select
                      value={filterPriority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:from-white focus:to-white transition-all duration-200"
                    >
                      <option value="">⚡ Todas as prioridades</option>
                      <option value="URGENT">🔴 Urgente</option>
                      <option value="HIGH">🟠 Alta</option>
                      <option value="MEDIUM">🟡 Média</option>
                      <option value="LOW">🟢 Baixa</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-baseline gap-2">
                {demands.length}
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  demanda{demands.length !== 1 ? 's' : ''} atribuída{demands.length !== 1 ? 's' : ''}
                </span>
              </h2>
              {pagination.total > demands.length && (
                <p className="text-sm text-slate-500 mt-1">
                  Mostrando {demands.length} de {pagination.total} resultados
                </p>
              )}
            </div>
            {demands.length > 0 && (
              <div className="px-4 py-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-semibold text-primary">
                  Página {pagination.page}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Demands List/Grid */}
        {demands.length === 0 ? (
          <div className="text-center py-20">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-16 max-w-xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl flex items-center justify-center shadow-inner">
                <CalendarCheck className="w-14 h-14 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Nenhuma demanda atribuída
              </h3>
              <p className="text-slate-500 mb-8 text-base leading-relaxed">
                Você não possui demandas atribuídas no momento.<br />
                Entre em contato com o coordenador para receber atribuições.
              </p>
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

                const statusBorderColor = {
                  PENDING: 'border-l-amber-400',
                  CHECK_IN: 'border-l-cyan-400',
                  IN_PROGRESS: 'border-l-blue-500',
                  RESOLVED: 'border-l-emerald-500',
                  REJECTED: 'border-l-red-500',
                  BILLED: 'border-l-green-600'
                }[demand.status] || 'border-l-slate-300'

                if (viewMode === 'list') {
                  // Verificar se existe outra demanda em progresso (que não seja esta)
                  const hasOtherInProgress = demands.some(d => 
                    d.status === 'IN_PROGRESS' && d.id !== demand.id
                  )

                  // Verificar se deve mostrar botões de ação rápida
                  const showQuickActions = demand.status === 'CHECK_IN' || demand.status === 'IN_PROGRESS'

                  return (
                    <div key={demand.id}>
                      <Link 
                        href={`/org/${currentOrg}/unit/${currentUnit}/demands/${demand.id}`}
                        className="block"
                      >
                        <div
                          className={`group rounded-xl sm:rounded-2xl border-l-4 ${statusBorderColor} bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden medical-fade-in`}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <div className="p-3 sm:p-6">
                            <div className="flex items-start gap-3 sm:gap-6">
                              {/* Paciente Info */}
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                <span className="text-lg sm:text-2xl font-bold">
                                  {demand.applicant_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </span>
                              </div>

                              {/* Main Content */}
                              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                                <div>
                                  <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight truncate mb-1">
                                        {demand.applicant_name}
                                      </h3>
                                      <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {category.label}
                                      </p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0 mt-0.5 sm:mt-1" size={20} />
                                  </div>
                                </div>

                                {/* Description */}
                                {demand.description && (
                                  <div className="flex gap-2">
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">Obs:</span>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 flex-1">
                                      {demand.description}
                                    </p>
                                  </div>
                                )}

                                {/* Scheduling Info */}
                                {demand.scheduled_date && (
                                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-50 to-purple-50/50 rounded-lg sm:rounded-xl border border-purple-100">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                      <Calendar size={14} className="text-white sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[9px] sm:text-[10px] text-purple-600 font-semibold uppercase tracking-wider">Agendamento</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-purple-900">
                                          {formatLocalDate(demand.scheduled_date, {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </span>
                                        {demand.scheduled_time && (
                                          <>
                                            <span className="text-purple-400">•</span>
                                            <span className="text-sm font-bold text-purple-900">{formatTime(demand.scheduled_time)}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Status Badge */}
                              <div className="flex sm:flex-col items-start sm:items-end gap-1.5 sm:gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                                <span className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-sm ${
                                  demand.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border sm:border-2 border-amber-200' :
                                  demand.status === 'CHECK_IN' ? 'bg-cyan-100 text-cyan-800 border sm:border-2 border-cyan-200' :
                                  demand.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border sm:border-2 border-blue-200' :
                                  demand.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border sm:border-2 border-emerald-200' :
                                  demand.status === 'BILLED' ? 'bg-green-100 text-green-900 border sm:border-2 border-green-200' :
                                  demand.status === 'REJECTED' ? 'bg-red-100 text-red-800 border sm:border-2 border-red-200' :
                                  'bg-slate-100 text-slate-800 border sm:border-2 border-slate-200'
                                }`}>
                                  <span className="hidden sm:inline">{status.label}</span>
                                  <span className="sm:hidden">{status.label.split(' ')[0]}</span>
                                </span>
                              </div>
                            </div>

                            {/* Quick Action Buttons - Dentro do Card */}
                            {showQuickActions && (
                              <div className="mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.preventDefault()}>
                                <QuickStatusActions 
                                  demandId={demand.id}
                                  currentStatus={demand.status as any}
                                  applicantName={demand.applicant_name}
                                  organizationSlug={currentOrg}
                                  unitSlug={currentUnit}
                                  hasOtherInProgress={hasOtherInProgress}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                }

                // Grid view (simplified version)
                return (
                  <Link 
                    key={demand.id}
                    href={`/org/${currentOrg}/unit/${currentUnit}/demands/${demand.id}`}
                    className="block"
                  >
                    <div className={`group rounded-lg sm:rounded-xl border-l-4 sm:border-l-[6px] ${statusBorderColor} bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden medical-fade-in h-full`}>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary mb-2">
                          {demand.applicant_name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{demand.description}</p>
                        {demand.scheduled_date && (
                          <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
                            <Calendar size={14} />
                            <span>{formatLocalDate(demand.scheduled_date)} {demand.scheduled_time && `• ${formatTime(demand.scheduled_time)}`}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            demand.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            demand.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="medical-section mt-8 sm:mt-12">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      pagination.has_prev
                        ? 'bg-white border sm:border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:shadow-md'
                        : 'bg-slate-50 border sm:border-2 border-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">Ant</span>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5 mx-2 sm:mx-3">
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
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                            isCurrentPage
                              ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/30 scale-110'
                              : 'bg-white border sm:border-2 border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:shadow-md'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      pagination.has_next
                        ? 'bg-white border sm:border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:shadow-md'
                        : 'bg-slate-50 border sm:border-2 border-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <span className="sm:hidden">Próx</span>
                    <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                <div className="text-center mt-4 sm:mt-6">
                  <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs sm:text-sm text-slate-600">
                      <span className="hidden sm:inline">Mostrando </span>
                    </span>
                    <span className="font-bold text-primary text-xs sm:text-sm">
                      {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600">
                      de
                    </span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      {pagination.total}
                    </span>
                    <span className="hidden sm:inline text-xs sm:text-sm text-slate-600">
                      demandas
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
