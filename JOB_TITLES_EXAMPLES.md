# Exemplos de Uso - Sistema de Cargos

## 1. Usar o Hook de Job Titles

```tsx
'use client'

import { useJobTitles } from '@/hooks/use-job-titles'

function MyComponent() {
  const organizationSlug = 'minha-org'
  
  const {
    jobTitles,        // Array de cargos
    isLoading,        // Estado de carregamento
    error,            // Erros
    createJobTitle,   // Função para criar
    updateJobTitle,   // Função para atualizar
    deleteJobTitle,   // Função para deletar
    isCreating,       // Estado de criação
    isUpdating,       // Estado de atualização
    isDeleting,       // Estado de deleção
  } = useJobTitles(organizationSlug)

  // Criar cargo
  const handleCreate = async () => {
    try {
      await createJobTitle({
        name: 'Médico',
        description: 'Profissional de saúde'
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Atualizar cargo
  const handleUpdate = async (jobTitleId: string) => {
    try {
      await updateJobTitle({
        jobTitleId,
        data: {
          name: 'Médico Senior',
          description: 'Médico com mais de 5 anos de experiência'
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Deletar cargo
  const handleDelete = async (jobTitleId: string) => {
    try {
      await deleteJobTitle(jobTitleId)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar cargos</div>

  return (
    <div>
      {jobTitles.map(job => (
        <div key={job.id}>{job.name}</div>
      ))}
    </div>
  )
}
```

## 2. Usar os Dialogs

### Dialog de Criar Cargo

```tsx
import { CreateJobTitleDialog } from '@/components/create-job-title-dialog'

function MyPage() {
  return (
    <div>
      <CreateJobTitleDialog organizationSlug="minha-org" />
    </div>
  )
}
```

### Dialog de Editar Cargo

```tsx
import { EditJobTitleDialog } from '@/components/edit-job-title-dialog'

function MyTable({ jobTitle }) {
  return (
    <EditJobTitleDialog
      organizationSlug="minha-org"
      jobTitle={jobTitle}
    >
      <button>Editar</button>
    </EditJobTitleDialog>
  )
}
```

### Dialog de Atribuir Cargo

```tsx
import { AssignJobTitleDialog } from '@/components/assign-job-title-dialog'

function MemberRow({ member }) {
  return (
    <AssignJobTitleDialog
      organizationSlug="minha-org"
      memberId={member.id}
      memberName={member.name}
    />
  )
}
```

## 3. Usar o Badge de Cargo

```tsx
import { MemberJobTitleBadge } from '@/components/member-job-title-badge'

function MemberCard({ member }) {
  return (
    <div>
      <h3>{member.name}</h3>
      <MemberJobTitleBadge
        jobTitle={{
          name: 'Médico',
          workDays: ['monday', 'wednesday', 'friday']
        }}
      />
    </div>
  )
}
```

## 4. Chamadas HTTP Diretas

### Listar Cargos

```tsx
import { getJobTitles } from '@/http/get-job-titles'

const result = await getJobTitles('minha-org')
console.log(result.jobTitles)
```

### Buscar Cargo Específico

```tsx
import { getJobTitle } from '@/http/get-job-title'

const result = await getJobTitle('minha-org', 'job-title-id')
console.log(result.jobTitle)
```

### Criar Cargo

```tsx
import { createJobTitle } from '@/http/create-job-title'

const result = await createJobTitle('minha-org', {
  name: 'Enfermeiro',
  description: 'Profissional de enfermagem'
})
console.log(result.jobTitleId)
```

### Atualizar Cargo

```tsx
import { updateJobTitle } from '@/http/update-job-title'

await updateJobTitle('minha-org', 'job-title-id', {
  name: 'Enfermeiro Sênior',
  description: 'Enfermeiro com mais de 5 anos'
})
```

### Deletar Cargo

```tsx
import { deleteJobTitle } from '@/http/delete-job-title'

await deleteJobTitle('minha-org', 'job-title-id')
```

### Atribuir Cargo a Membro

```tsx
import { assignJobTitleToMember } from '@/http/assign-job-title'

await assignJobTitleToMember('minha-org', 'member-id', {
  jobTitleId: 'job-title-id',
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
})
```

### Remover Cargo de Membro

```tsx
import { removeJobTitleFromMember } from '@/http/remove-job-title'

await removeJobTitleFromMember('minha-org', 'member-id')
```

## 5. Página Completa (Exemplo)

```tsx
// page.tsx (Server Component)
import { Header } from '@/components/header'
import { JobTitlesList } from './job-titles-list'

interface PageProps {
  params: Promise<{ org: string }>
}

export default async function JobTitlesPage({ params }: PageProps) {
  const { org } = await params
  
  return (
    <>
      <Header />
      <JobTitlesList organizationSlug={org} />
    </>
  )
}
```

```tsx
// job-titles-list.tsx (Client Component)
'use client'

import { useJobTitles } from '@/hooks/use-job-titles'
import { CreateJobTitleDialog } from '@/components/create-job-title-dialog'
import { EditJobTitleDialog } from '@/components/edit-job-title-dialog'

export function JobTitlesList({ organizationSlug }: { organizationSlug: string }) {
  const { jobTitles, isLoading, deleteJobTitle } = useJobTitles(organizationSlug)

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      <CreateJobTitleDialog organizationSlug={organizationSlug} />
      
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {jobTitles.map(job => (
            <tr key={job.id}>
              <td>{job.name}</td>
              <td>{job.description}</td>
              <td>
                <EditJobTitleDialog 
                  organizationSlug={organizationSlug}
                  jobTitle={job}
                />
                <button onClick={() => deleteJobTitle(job.id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## 6. Validação com Zod

```tsx
import { z } from 'zod'

// Schema para criar/editar cargo
const jobTitleSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  description: z.string().optional(),
})

// Schema para atribuir cargo
const assignJobTitleSchema = z.object({
  jobTitleId: z.string().min(1, 'Selecione um cargo'),
  workDays: z.array(z.string()).min(1, 'Selecione pelo menos um dia'),
})
```

## 7. React Query - Invalidação de Cache

```tsx
import { useQueryClient } from '@tanstack/react-query'

function MyComponent() {
  const queryClient = useQueryClient()

  // Invalidar cache após operação
  const handleSuccess = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['job-titles', organizationSlug] 
    })
  }
}
```

## 8. Toast Notifications

```tsx
import { toast } from 'sonner'

// Sucesso
toast.success('Cargo criado com sucesso!')

// Erro
toast.error('Erro ao criar cargo. Tente novamente.')

// Info
toast.info('Processando...')

// Warning
toast.warning('Atenção: Este cargo tem membros associados')
```

## 9. Tipos TypeScript

```typescript
// Importar tipos
import type { JobTitle } from '@/http/get-job-titles'
import type { CreateJobTitleRequest } from '@/http/create-job-title'
import type { UpdateJobTitleRequest } from '@/http/update-job-title'
import type { AssignJobTitleRequest } from '@/http/assign-job-title'

// Usar tipos
const jobTitle: JobTitle = {
  id: '123',
  name: 'Médico',
  description: 'Profissional de saúde',
  organizationId: 'org-123',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
}
```

## 10. Error Handling

```tsx
import { toast } from 'sonner'

async function handleOperation() {
  try {
    await createJobTitle({
      name: 'Novo Cargo',
      description: 'Descrição'
    })
    toast.success('Operação realizada com sucesso!')
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Erro desconhecido')
    }
    console.error('Erro detalhado:', error)
  }
}
```

---

## Dicas de Boas Práticas

1. **Sempre use o hook** `useJobTitles` ao invés de chamadas HTTP diretas
2. **Valide dados** com Zod antes de enviar ao servidor
3. **Mostre feedback** visual com toasts em todas as operações
4. **Desabilite botões** durante operações assíncronas
5. **Trate erros** de forma apropriada e amigável ao usuário
6. **Use Server Components** quando possível para melhor performance
7. **Separe Client Components** apenas onde necessário (interatividade)
8. **Invalide cache** após mutações para manter dados atualizados

---

**Precisa de mais exemplos?** Consulte os componentes já implementados em:
- `src/components/create-job-title-dialog.tsx`
- `src/components/edit-job-title-dialog.tsx`
- `src/components/assign-job-title-dialog.tsx`
- `src/app/(app)/org/[org]/job-titles/job-titles-list.tsx`
