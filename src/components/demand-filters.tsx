import { useState } from 'react'
import { Calendar, Filter, X } from 'lucide-react'
import { CATEGORY_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/constants/demand-translations'

interface DemandFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export function DemandFilters({ filters, onFiltersChange, onClearFilters }: DemandFiltersProps) {
  const [showDateFilters, setShowDateFilters] = useState(false)

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 'created_at' && value !== 'desc'
  )

  return (
    <div className="space-y-4">
      {/* Filtros Básicos */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ category: e.target.value || undefined })}
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
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({ status: e.target.value || undefined })}
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
          value={filters.priority || ''}
          onChange={(e) => onFiltersChange({ priority: e.target.value || undefined })}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all min-w-[180px]"
        >
          <option value="">Todas as prioridades</option>
          <option value="URGENT">🔴 Urgente</option>
          <option value="HIGH">🟠 Alta</option>
          <option value="MEDIUM">🟡 Média</option>
          <option value="LOW">🟢 Baixa</option>
        </select>

        <button
          onClick={() => setShowDateFilters(!showDateFilters)}
          className={`flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl transition-all ${
            showDateFilters ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100'
          }`}
        >
          <Calendar size={18} />
          <span>Datas</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-3 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-red-600"
          >
            <X size={18} />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Filtros de Data */}
      {showDateFilters && (
        <div className="p-4 bg-gray-50 rounded-xl space-y-4 animate-in slide-in-from-top duration-300">
          <h4 className="font-medium text-gray-900">Filtrar por Data</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Criação - De:
              </label>
              <input
                type="date"
                value={filters.created_at_from || ''}
                onChange={(e) => onFiltersChange({ created_at_from: e.target.value || undefined })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Criação - Até:
              </label>
              <input
                type="date"
                value={filters.created_at_to || ''}
                onChange={(e) => onFiltersChange({ created_at_to: e.target.value || undefined })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última Atualização - De:
              </label>
              <input
                type="date"
                value={filters.updated_at_from || ''}
                onChange={(e) => onFiltersChange({ updated_at_from: e.target.value || undefined })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última Atualização - Até:
              </label>
              <input
                type="date"
                value={filters.updated_at_to || ''}
                onChange={(e) => onFiltersChange({ updated_at_to: e.target.value || undefined })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}