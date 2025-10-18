import { Header } from '@/components/header'
import { DemandForm } from './create-demand-form'
import { ApplicantName } from '@/components/applicant-name'
import { FileText } from 'lucide-react'
import { BackButton } from '@/components/back-button'

export default function CreateDemandPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb e navegação */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Header da página */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Registrar Consulta</h1>
                <p className="text-muted-foreground mt-1">
                  Crie uma nova solicitação para o paciente
                </p>
              </div>
            </div>

            {/* Card com informações do paciente */}
            <div className="medical-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Paciente Selecionado
                </span>
              </div>
              <ApplicantName />
            </div>
          </div>

          {/* Formulário */}
          <DemandForm />
        </div>
      </main>
    </>
  )
}