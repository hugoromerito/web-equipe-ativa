# Exemplos de Uso das Funções HTTP

Este documento contém exemplos práticos de como usar as funções HTTP implementadas.

## 📋 Índice

- [Autenticação](#autenticação)
- [Organizações](#organizações)
- [Unidades](#unidades)
- [Usuários](#usuários)
- [Membros](#membros)
- [Convites](#convites)
- [Pacientes](#pacientes)
- [Consultas](#consultas)
- [Anexos](#anexos)

---

## 🔐 Autenticação

### Recuperação de Senha

```typescript
import { requestPasswordRecover, resetPassword } from '@/http'

// 1. Solicitar recuperação de senha
async function handleForgotPassword(email: string) {
  try {
    await requestPasswordRecover({ email })
    alert('Email de recuperação enviado!')
  } catch (error) {
    console.error('Erro ao solicitar recuperação:', error)
  }
}

// 2. Resetar senha com código
async function handleResetPassword(code: string, newPassword: string) {
  try {
    await resetPassword({ code, password: newPassword })
    alert('Senha alterada com sucesso!')
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
  }
}
```

---

## 🏢 Organizações

### Encerrar Organização

```typescript
import { shutdownOrganization } from '@/http'

async function handleShutdownOrg(orgSlug: string) {
  if (confirm('Tem certeza que deseja encerrar esta organização?')) {
    try {
      await shutdownOrganization({ organizationSlug: orgSlug })
      alert('Organização encerrada!')
    } catch (error) {
      console.error('Erro ao encerrar organização:', error)
    }
  }
}
```

---

## 👥 Usuários

### Listar Usuários com Filtros

```typescript
import { getUsers } from '@/http'

async function loadUsers(orgSlug: string) {
  try {
    const result = await getUsers({
      organizationSlug: orgSlug,
      page: 1,
      limit: 20,
      search: 'joão',
      role: 'ADMIN',
      sortBy: 'name',
      sortOrder: 'asc',
    })

    console.log('Usuários:', result.users)
    console.log('Total:', result.pagination.total)
    console.log('Páginas:', result.pagination.total_pages)
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}
```

### Criar Usuário

```typescript
import { createUser } from '@/http'

async function handleCreateUser(orgSlug: string) {
  try {
    const result = await createUser({
      organizationSlug: orgSlug,
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      role: 'CLERK',
      unitSlug: 'unidade-central', // Opcional
    })

    console.log('Usuário criado:', result.userId)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
  }
}
```

---

## 👤 Membros

### Listar Membros da Organização

```typescript
import { getMembersOrganization } from '@/http'

async function loadOrgMembers(orgSlug: string) {
  try {
    const result = await getMembersOrganization({
      organizationSlug: orgSlug,
      page: 1,
      pageSize: 10,
    })

    result.members.forEach((member) => {
      console.log(`${member.user.name} - ${member.organization_role}`)
    })

    console.log('Total de membros:', result.totalCount)
  } catch (error) {
    console.error('Erro ao carregar membros:', error)
  }
}
```

### Listar Membros da Unidade

```typescript
import { getMembersUnit } from '@/http'

async function loadUnitMembers(orgSlug: string, unitSlug: string) {
  try {
    const result = await getMembersUnit({
      organizationSlug: orgSlug,
      unitSlug,
      page: 1,
      pageSize: 10,
    })

    result.members.forEach((member) => {
      console.log(`${member.user.name} - ${member.unit_role || 'Sem role'}`)
    })
  } catch (error) {
    console.error('Erro ao carregar membros da unidade:', error)
  }
}
```

---

## ✉️ Convites

### Criar Convite

```typescript
import { createInvite } from '@/http'

async function handleCreateInvite(orgSlug: string) {
  try {
    const result = await createInvite({
      organizationSlug: orgSlug,
      email: 'novomembro@example.com',
      role: 'CLERK',
      unitSlug: 'unidade-sul', // Opcional
    })

    console.log('Convite criado:', result.inviteId)
  } catch (error) {
    console.error('Erro ao criar convite:', error)
  }
}
```

### Listar Convites Pendentes

```typescript
import { getInvites } from '@/http'

async function loadPendingInvites() {
  try {
    const result = await getInvites()

    result.invites.forEach((invite) => {
      console.log(`Convite de ${invite.author?.name} para ${invite.role}`)
      if (invite.unit) {
        console.log(`Unidade: ${invite.unit.name}`)
      }
    })
  } catch (error) {
    console.error('Erro ao carregar convites:', error)
  }
}
```

### Listar Convites da Organização

```typescript
import { getOrganizationInvites } from '@/http'

async function loadOrgInvites(orgSlug: string) {
  try {
    const result = await getOrganizationInvites({
      organizationSlug: orgSlug,
    })

    result.invites.forEach((invite) => {
      console.log(`${invite.email} - ${invite.role}`)
    })
  } catch (error) {
    console.error('Erro ao carregar convites da organização:', error)
  }
}
```

---

## 📋 Pacientes

### Listar Consultas do Paciente

```typescript
import { getApplicantDemands } from '@/http'

async function loadApplicantDemands(orgSlug: string, applicantSlug: string) {
  try {
    const result = await getApplicantDemands({
      organizationSlug: orgSlug,
      applicantSlug,
    })

    console.log('Paciente:', result.applicant.name)
    console.log('Total de consultas:', result.demands.length)

    result.demands.forEach((demand) => {
      console.log(
        `${demand.title} - ${demand.status} - ${demand.priority} - ${demand.category}`
      )
    })
  } catch (error) {
    console.error('Erro ao carregar consultas do paciente:', error)
  }
}
```

---

## 📊 Consultas

### Atualizar Consulta

```typescript
import { updateDemand } from '@/http'

async function handleUpdateDemand(
  orgSlug: string,
  unitSlug: string,
  demandId: string
) {
  try {
    const result = await updateDemand({
      organizationSlug: orgSlug,
      unitSlug,
      demandId,
      title: 'Novo Título',
      description: 'Nova descrição',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    })

    console.log('Consulta atualizada:', result.demand)
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error)
  }
}

// Atualizar apenas o status
async function handleUpdateStatus(
  orgSlug: string,
  unitSlug: string,
  demandId: string
) {
  try {
    const result = await updateDemand({
      organizationSlug: orgSlug,
      unitSlug,
      demandId,
      status: 'RESOLVED',
    })

    console.log('Status atualizado:', result.demand.status)
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}
```

---

## 📎 Anexos

### Upload de Avatar

```typescript
import {
  uploadUserAvatar,
  uploadApplicantAvatar,
  uploadOrganizationAvatar,
} from '@/http'

// Upload de avatar do usuário
async function handleUserAvatarUpload(file: File) {
  try {
    const result = await uploadUserAvatar({ file })
    console.log('Avatar enviado:', result.url)
  } catch (error) {
    console.error('Erro ao enviar avatar:', error)
  }
}

// Upload de avatar do paciente
async function handleApplicantAvatarUpload(
  orgSlug: string,
  applicantId: string,
  file: File
) {
  try {
    const result = await uploadApplicantAvatar({
      organizationSlug: orgSlug,
      applicantId,
      file,
    })
    console.log('Avatar enviado:', result.url)
  } catch (error) {
    console.error('Erro ao enviar avatar:', error)
  }
}

// Upload de avatar da organização
async function handleOrgAvatarUpload(orgSlug: string, file: File) {
  try {
    const result = await uploadOrganizationAvatar({
      organizationSlug: orgSlug,
      file,
    })
    console.log('Avatar enviado:', result.url)
  } catch (error) {
    console.error('Erro ao enviar avatar:', error)
  }
}
```

### Upload de Documentos

```typescript
import {
  uploadApplicantDocument,
  uploadDemandDocument,
  uploadOrganizationDocument,
} from '@/http'

// Upload de documento do paciente
async function handleApplicantDocUpload(
  orgSlug: string,
  applicantId: string,
  file: File
) {
  try {
    const result = await uploadApplicantDocument({
      organizationSlug: orgSlug,
      applicantId,
      file,
      type: 'DOCUMENT',
    })
    console.log('Documento enviado:', result.url)
  } catch (error) {
    console.error('Erro ao enviar documento:', error)
  }
}

// Upload de documento da consulta
async function handleDemandDocUpload(
  orgSlug: string,
  demandId: string,
  file: File
) {
  try {
    const result = await uploadDemandDocument({
      organizationSlug: orgSlug,
      demandId,
      file,
      type: 'PDF',
    })
    console.log('Documento enviado:', result.url)
  } catch (error) {
    console.error('Erro ao enviar documento:', error)
  }
}
```

### Listar Anexos

```typescript
import { getAttachments } from '@/http'

async function loadAttachments(orgSlug: string) {
  try {
    const result = await getAttachments({
      organizationSlug: orgSlug,
      page: 1,
      limit: 20,
      type: 'DOCUMENT',
      demandId: 'uuid-da-consulta', // Opcional
    })

    result.attachments.forEach((attachment) => {
      console.log(
        `${attachment.originalName} - ${attachment.type} - ${attachment.size} bytes`
      )
      if (attachment.user) {
        console.log(`Enviado por: ${attachment.user.name}`)
      }
    })

    console.log('Total:', result.pagination.total)
  } catch (error) {
    console.error('Erro ao carregar anexos:', error)
  }
}
```

### Download de Anexo

```typescript
import { downloadAttachment } from '@/http'

async function handleDownload(orgSlug: string, attachmentId: string) {
  try {
    const response = await downloadAttachment({
      organizationSlug: orgSlug,
      attachmentId,
      inline: false, // true para visualizar no navegador
    })

    // Processar download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'arquivo'
    a.click()
  } catch (error) {
    console.error('Erro ao baixar anexo:', error)
  }
}
```

### Deletar Anexo

```typescript
import { deleteAttachment } from '@/http'

async function handleDeleteAttachment(orgSlug: string, attachmentId: string) {
  if (confirm('Tem certeza que deseja deletar este anexo?')) {
    try {
      await deleteAttachment({
        organizationSlug: orgSlug,
        attachmentId,
      })
      alert('Anexo deletado!')
    } catch (error) {
      console.error('Erro ao deletar anexo:', error)
    }
  }
}
```

---

## 🎨 Usando Constantes e Traduções

```typescript
import {
  translateAttachmentType,
  translateDemandPriority,
  translateDemandStatus,
  translateDemandCategory,
  translateRole,
} from '@/constants'

// Traduzir tipo de anexo
console.log(translateAttachmentType('DOCUMENT')) // "Documento"
console.log(translateAttachmentType('AVATAR')) // "Avatar"

// Traduzir prioridade de consulta
console.log(translateDemandPriority('HIGH')) // "Alta"
console.log(translateDemandPriority('URGENT')) // "Urgente"

// Traduzir status de consulta
console.log(translateDemandStatus('IN_PROGRESS')) // "Em Progresso"
console.log(translateDemandStatus('RESOLVED')) // "Resolvido"

// Traduzir categoria de consulta
console.log(translateDemandCategory('HEALTH')) // "Saúde"
console.log(translateDemandCategory('EDUCATION')) // "Educação"

// Traduzir role
console.log(translateRole('ADMIN')) // "Admin"
console.log(translateRole('MANAGER')) // "Gestor"
```

---

## 🎣 Usando com React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, createUser, updateDemand } from '@/http'

// Hook para listar usuários
function useUsers(orgSlug: string, page: number = 1) {
  return useQuery({
    queryKey: ['users', orgSlug, page],
    queryFn: () =>
      getUsers({
        organizationSlug: orgSlug,
        page,
        limit: 20,
      }),
  })
}

// Hook para criar usuário
function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Hook para atualizar consulta
function useUpdateDemand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDemand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
    },
  })
}

// Uso em componente
function UsersPage({ orgSlug }: { orgSlug: string }) {
  const { data, isLoading } = useUsers(orgSlug)
  const createUserMutation = useCreateUser()

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      <h1>Usuários ({data?.pagination.total})</h1>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.membership.organization_role}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 📝 Notas Importantes

1. **Autenticação**: Todas as requisições (exceto login e recuperação de senha) requerem token JWT no header.

2. **Tratamento de Erros**: Sempre use try/catch para capturar erros das requisições.

3. **Tipos TypeScript**: Todas as funções possuem tipagem completa para melhor IntelliSense.

4. **Paginação**: Funções de listagem retornam informações de paginação (total, páginas, etc.).

5. **Upload de Arquivos**: Use `FormData` para enviar arquivos. Aceite apenas tipos permitidos.

6. **Cache**: Use React Query ou SWR para gerenciar cache de dados.
