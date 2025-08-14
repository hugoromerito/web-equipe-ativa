'use client'
import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-32 h-32 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Algo deu errado!
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Não foi possível carregar as demandas. Por favor, tente novamente.
        </p>
        
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Tentar novamente
        </button>
      </div>
    </div>
  )
}