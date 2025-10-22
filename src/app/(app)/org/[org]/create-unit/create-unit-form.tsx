'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormState } from '@/hooks/use-form-state'
import { createUnitAction, type UnitSchema } from './actions'
import { useRouter } from 'next/navigation'

interface UnitFormProps {
  isUpdating?: boolean
  initialData?: UnitSchema
}

export function UnitForm({ initialData }: UnitFormProps) {
  const formAction = createUnitAction
  const router = useRouter()
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {
      router.back()
    },
  )

  return (
    <div className="medical-card p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {success === false && message && (
          <Alert className="medical-alert-danger">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao criar unidade!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        {success === true && message && (
          <Alert className="medical-alert-success">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="medical-form-group">
          <Label htmlFor="name" className="medical-form-label">
            Nome da unidade médico
          </Label>
          <Input 
            name="name" 
            id="name" 
            defaultValue={initialData?.name} 
            className="medical-form-input"
            placeholder="Ex: UTI, Emergência, Cardiologia..."
          />
          {errors?.name && (
            <p className="medical-form-error">
              {errors.name[0]}
            </p>
          )}
          <p className="medical-form-help">
            Digite o nome da unidade ou departamento médico
          </p>
        </div>

        <div className="medical-form-group">
          <Label htmlFor="description" className="medical-form-label">
            Descrição da unidade
          </Label>
          <Input 
            name="description" 
            id="description" 
            className="medical-form-input"
            placeholder="Descreva as atividades e especialidades da unidade..."
          />
          {errors?.description && (
            <p className="medical-form-error">
              {errors.description[0]}
            </p>
          )}
          <p className="medical-form-help">
            Opcional: Forneça uma breve descrição das atividades da unidade
          </p>
        </div>

        <div className="medical-form-group">
          <Label htmlFor="location" className="medical-form-label">
            Localização da unidade
          </Label>
          <Input 
            name="location" 
            id="location" 
            className="medical-form-input"
            placeholder="Ex: 2º andar - Ala Norte, Bloco A..."
          />
          {errors?.location && (
            <p className="medical-form-error">
              {errors.location[0]}
            </p>
          )}
          <p className="medical-form-help">
            Opcional: Informe a localização física da unidade na instituição
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <Button 
            className="btn-medical-primary w-full h-12 text-base font-semibold" 
            type="submit" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
                Crianda unidade...
              </>
            ) : (
              'Criar unidade médica'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
