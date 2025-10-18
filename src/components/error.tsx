'use client'
import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

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
    <div className="min-h-screen medical-layout flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="medical-card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Algo deu errado!
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Não foi possível carregar o conteúdo. Por favor, tente novamente ou entre em contato com o suporte.
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg text-left">
              <p className="text-xs text-muted-foreground font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <Button
            onClick={reset}
            className="medical-gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  )
}