# Sistema de Cargos (Job Titles) - Documentação

## Visão Geral

Sistema completo para gerenciamento de cargos/funções organizacionais e atribuição aos membros da equipe, incluindo definição de dias de trabalho.

## Estrutura de Arquivos

### 📁 HTTP Layer (`src/http/`)

#### Gerenciamento de Cargos
- **`get-job-titles.ts`** - Lista todos os cargos da organização
- **`get-job-title.ts`** - Busca um cargo específico por ID
- **`create-job-title.ts`** - Cria um novo cargo
- **`update-job-title.ts`** - Atualiza informações de um cargo
- **`delete-job-title.ts`** - Remove um cargo do sistema

#### Atribuição de Cargos
- **`assign-job-title.ts`** - Atribui cargo e dias de trabalho a um membro
- **`remove-job-title.ts`** - Remove atribuição de cargo de um membro

### 📁 Hooks (`src/hooks/`)

- **`use-job-titles.ts`** - Hook React Query para gerenciar estado dos cargos
  - Lista cargos
  - Cria novo cargo
  - Atualiza cargo existente
  - Deleta cargo
  - Gerencia estados de loading e erros

### 📁 Componentes (`src/components/`)

- **`create-job-title-dialog.tsx`** - Dialog para criar novos cargos
- **`edit-job-title-dialog.tsx`** - Dialog para editar cargos existentes
- **`assign-job-title-dialog.tsx`** - Dialog para atribuir cargo e dias de trabalho aos membros

### 📁 Páginas (`src/app/(app)/org/[org]/`)

#### Job Titles
- **`job-titles/page.tsx`** - Página principal (Server Component)
- **`job-titles/job-titles-list.tsx`** - Lista interativa de cargos (Client Component)

## Funcionalidades

### 1. Gerenciamento de Cargos

#### Criar Cargo
- Campo obrigatório: Nome do cargo
- Campo opcional: Descrição detalhada
- Validação com Zod
- Feedback visual com toasts

#### Listar Cargos
- Tabela responsiva com todos os cargos
- Informações exibidas:
  - Nome do cargo
  - Descrição
  - Data de criação
  - Ações (editar/deletar)

#### Editar Cargo
- Edição inline via dialog
- Pré-carrega dados existentes
- Atualização em tempo real

#### Deletar Cargo
- Confirmação via AlertDialog
- Verifica se há membros associados
- Feedback de erro caso existam dependências

### 2. Atribuição de Cargos aos Membros

#### Funcionalidades
- Seleção de cargo via dropdown
- Seleção múltipla de dias de trabalho:
  - Segunda-feira a Domingo
  - Mínimo: 1 dia
  - Interface com checkboxes
- Integrado na página de membros
- Invalidação automática de cache

#### Dias da Semana Suportados
```typescript
- monday (Segunda-feira)
- tuesday (Terça-feira)
- wednesday (Quarta-feira)
- thursday (Quinta-feira)
- friday (Sexta-feira)
- saturday (Sábado)
- sunday (Domingo)
```

## Endpoints da API

### Cargos

```
POST   /organizations/{organizationSlug}/job-titles
GET    /organizations/{organizationSlug}/job-titles
GET    /organizations/{organizationSlug}/job-titles/{jobTitleId}
PATCH  /organizations/{organizationSlug}/job-titles/{jobTitleId}
DELETE /organizations/{organizationSlug}/job-titles/{jobTitleId}
```

### Atribuição (Assumidos)

```
POST   /organizations/{organizationSlug}/members/{memberId}/job-title
DELETE /organizations/{organizationSlug}/members/{memberId}/job-title
```

## Schemas de Dados

### JobTitle
```typescript
interface JobTitle {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}
```

### AssignJobTitleRequest
```typescript
interface AssignJobTitleRequest {
  jobTitleId: string
  workDays?: string[] // ['monday', 'tuesday', ...]
}
```

## Validações

### Criar/Editar Cargo
```typescript
{
  name: string (1-100 caracteres) - Obrigatório
  description: string - Opcional
}
```

### Atribuir Cargo
```typescript
{
  jobTitleId: string - Obrigatório
  workDays: string[] (min: 1 dia) - Obrigatório
}
```

## Uso

### Acessar Página de Cargos
```
/org/{organizationSlug}/job-titles
```

### Integração na Página de Membros
A página de membros (`/org/{organizationSlug}/members`) já inclui o botão "Atribuir Cargo" para cada membro da organização.

## Componentes UI Utilizados

- Dialog (shadcn/ui)
- AlertDialog (shadcn/ui)
- Button
- Input
- Textarea
- Select
- Checkbox
- Table
- Badge
- Card
- Label

## Estados de Loading

Todos os componentes incluem estados de loading apropriados:
- Spinners durante operações assíncronas
- Desabilitação de botões durante submissão
- Feedback visual em tempo real

## Tratamento de Erros

- Toast notifications para sucesso/erro
- Validação de formulário com mensagens específicas
- Prevenção de ações durante operações em andamento
- Verificação de dependências antes de deletar

## Cache e Invalidação

O sistema usa React Query para:
- Cache automático de dados
- Invalidação inteligente após mutações
- Refetch automático quando necessário
- Otimização de requisições

## Permissões

⚠️ **Nota**: O sistema atual não implementa verificação de permissões. Para produção, adicione verificação de roles (ADMIN, etc.) antes de permitir:
- Criação de cargos
- Edição de cargos
- Deleção de cargos
- Atribuição de cargos

## Melhorias Futuras

1. **Visualização de Cargos Atribuídos**
   - Mostrar cargo atual do membro na tabela
   - Badge com dias de trabalho
   - Histórico de cargos

2. **Filtros e Busca**
   - Buscar cargos por nome
   - Filtrar por quantidade de membros
   - Ordenação customizada

3. **Estatísticas**
   - Quantidade de membros por cargo
   - Gráficos de distribuição
   - Relatórios de alocação

4. **Bulk Operations**
   - Atribuir mesmo cargo a múltiplos membros
   - Atualização em massa de dias de trabalho

5. **Auditoria**
   - Log de alterações
   - Histórico de atribuições
   - Quem fez qual mudança

## Exemplo de Fluxo Completo

1. Administrador acessa `/org/minha-org/job-titles`
2. Clica em "Novo Cargo"
3. Preenche nome "Médico Cardiologista" e descrição
4. Salva o cargo
5. Acessa `/org/minha-org/members`
6. Localiza o membro "Dr. João Silva"
7. Clica em "Atribuir Cargo"
8. Seleciona "Médico Cardiologista"
9. Marca Segunda, Quarta e Sexta como dias de trabalho
10. Confirma a atribuição

## Tecnologias

- **Next.js 14** - App Router
- **React Query** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications

---

**Status**: ✅ Implementação Completa
**Versão**: 1.0.0
**Data**: 2025-10-19
