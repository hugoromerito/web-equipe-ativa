'use client'

import { Monitor, ExternalLink, Info } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface TVDisplayShortcutProps {
  organizationSlug: string
  unitSlug: string
}

export function TVDisplayShortcut({ organizationSlug, unitSlug }: TVDisplayShortcutProps) {
  const [showInfo, setShowInfo] = useState(false)
  
  const tvUrl = `/org/${organizationSlug}/unit/${unitSlug}/tv-display`
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${tvUrl}`
    : tvUrl

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(fullUrl)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
            <Monitor className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Display da Recepção</h3>
            <p className="text-sm text-slate-600">Tela de chamada de pacientes</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          title="Informações"
        >
          <Info className="h-5 w-5 text-blue-600" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 space-y-2">
          <p className="font-semibold text-blue-900">Como usar:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Abra o link na TV da recepção</li>
            <li>Pressione F11 para tela cheia</li>
            <li>Quando o médico mudar o status para "Em andamento", o paciente aparecerá na tela</li>
            <li>Atualização automática a cada 3 segundos</li>
          </ol>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={tvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir Display
        </Link>
        <button
          onClick={copyToClipboard}
          className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
          title="Copiar link"
        >
          📋
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Atualização automática ativa</span>
        </div>
      </div>
    </div>
  )
}
