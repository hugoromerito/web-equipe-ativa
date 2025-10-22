import { Header } from '@/components/header'
import { UnitForm } from './create-unit-form'
import { Building } from 'lucide-react'

export default function CreateUnitPage() {
  return (
    <>
      <Header />
      <div className="space-y-8">
        {/* Header melhorado */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Criar Nova unidade
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure uma nova unidade médico para organizar melhor sua equipe e operações.
          </p>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl mx-auto">
          <UnitForm />
        </div>
      </div>
    </>
  )
}
