import { ability } from '@/lib/auth'
import { Header } from '@/components/header'
import { DemandDetails } from './demand-details'

export default async function DemandsPage() {
  const permissions = await ability()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_25%,rgba(59,130,246,0.02)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.02)_75%)] bg-[length:20px_20px]" />
      
      <div className="relative z-10">
        <Header />
        
        {/* Main Content */}
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Detalhes da Demanda
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visualize e gerencie todas as informações relacionadas à solicitação
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center">
            {permissions?.can('get', 'Demand') ? (
              <DemandDetails />
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-red-100">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Você não possui permissão para visualizar os detalhes desta demanda. 
                  Entre em contato com o administrador se precisar de acesso.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer Decoration */}
        <div className="mt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}