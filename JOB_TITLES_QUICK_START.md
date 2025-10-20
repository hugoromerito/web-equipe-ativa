# Sistema de Cargos - Guia Rápido

## 🚀 Acesso Rápido

### URLs das Páginas
- **Gerenciar Cargos**: `/org/{organizationSlug}/job-titles`
- **Atribuir a Membros (Listagem)**: `/org/{organizationSlug}/members`
- **Atribuir Cargo (Página Dedicada)**: `/org/{organizationSlug}/members/{memberId}/assign-job-title` ⭐ NEW

## 📋 Funcionalidades Implementadas

### ✅ Gerenciamento de Cargos
- [x] Criar cargo com nome e descrição
- [x] Listar todos os cargos
- [x] Editar informações do cargo
- [x] Deletar cargo com confirmação
- [x] Validação de formulários

### ✅ Atribuição de Cargos
- [x] Atribuir cargo a membro
- [x] Selecionar dias de trabalho (Seg-Dom)
- [x] Interface intuitiva com checkboxes
- [x] Integração na página de membros
- [x] Página dedicada para atribuição ⭐ NEW
- [x] Informações visuais do membro
- [x] Atalhos para dias de trabalho

## 📁 Arquivos Criados

### HTTP (src/http/)
```
✓ get-job-titles.ts       - Lista cargos
✓ get-job-title.ts         - Busca cargo específico
✓ create-job-title.ts      - Cria novo cargo
✓ update-job-title.ts      - Atualiza cargo
✓ delete-job-title.ts      - Remove cargo
✓ assign-job-title.ts      - Atribui cargo a membro
✓ remove-job-title.ts      - Remove cargo de membro
```

### Hooks (src/hooks/)
```
✓ use-job-titles.ts        - Gerencia estado dos cargos
```

### Componentes (src/components/)
```
✓ create-job-title-dialog.tsx      - Dialog criar cargo
✓ edit-job-title-dialog.tsx        - Dialog editar cargo
✓ assign-job-title-dialog.tsx      - Dialog atribuir cargo
✓ member-job-title-badge.tsx       - Badge com tooltip (bonus)
```

### Páginas (src/app/(app)/org/[org]/)
```
✓ job-titles/page.tsx                           - Página principal (Server)
✓ job-titles/job-titles-list.tsx                - Lista interativa (Client)
✓ members/[member]/assign-job-title/page.tsx    - Página dedicada atribuição ⭐ NEW
✓ members/[member]/assign-job-title/
    assign-job-title-form.tsx                   - Formulário completo ⭐ NEW
```

### Documentação
```
✓ JOB_TITLES_DOCUMENTATION.md      - Documentação completa
```

## 🎨 UI Components Instalados
- ✅ AlertDialog (shadcn/ui)

## 🔧 Tecnologias Utilizadas
- Next.js 14 (App Router)
- React Query (TanStack Query)
- React Hook Form + Zod
- shadcn/ui Components
- Tailwind CSS
- Sonner (Toasts)

## 💡 Como Usar

### 1. Criar um Cargo
1. Acesse `/org/sua-org/job-titles`
2. Clique em "Novo Cargo"
3. Preencha nome e descrição (opcional)
4. Clique em "Criar Cargo"

### 2. Editar um Cargo
1. Na lista de cargos, clique no menu ⋮
2. Selecione "Editar"
3. Faça as alterações
4. Clique em "Salvar Alterações"

### 3. Deletar um Cargo
1. Na lista de cargos, clique no menu ⋮
2. Selecione "Deletar"
3. Confirme a ação no dialog

### 4. Atribuir Cargo a um Membro

#### Opção A: Via Dialog (Rápido)
1. Acesse `/org/sua-org/members`
2. Localize o membro desejado
3. Clique em "Atribuir Cargo"
4. Selecione o cargo
5. Marque os dias de trabalho
6. Clique em "Atribuir Cargo"

#### Opção B: Via Página Dedicada ⭐ NEW
1. Acesse `/org/sua-org/members`
2. Localize o membro desejado
3. Clique no ícone 🔗 (link externo)
4. Na página dedicada:
   - Veja as informações do membro
   - Selecione o cargo no dropdown
   - Use atalhos para selecionar dias (Todos, Dias Úteis, Fim de Semana)
   - Clique em "Atribuir Cargo"

#### Acesso Direto
URL: `/org/{organizationSlug}/members/{memberId}/assign-job-title`

Exemplo: `/org/minha-org/members/user-123/assign-job-title`

## 📊 Estrutura de Dados

### Cargo (JobTitle)
```typescript
{
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}
```

### Atribuição
```typescript
{
  jobTitleId: string
  workDays: ['monday', 'tuesday', 'wednesday', ...]
}
```

## 🎯 Features Adicionais

### Badge de Cargo (Bonus Component)
Use `<MemberJobTitleBadge />` para exibir o cargo de um membro com tooltip mostrando os dias de trabalho.

## ⚠️ Importante

### Endpoints Assumidos
Os seguintes endpoints foram assumidos e podem precisar de ajuste conforme sua API:
- `POST /organizations/{slug}/members/{id}/job-title`
- `DELETE /organizations/{slug}/members/{id}/job-title`

### Permissões
⚠️ O sistema não implementa verificação de permissões. Adicione verificação de roles conforme necessário.

## 🐛 Troubleshooting

### Erro ao deletar cargo
- Verifique se não há membros com este cargo atribuído
- A API deve retornar erro apropriado se houver dependências

### Cargo não aparece na lista
- Verifique se o organizationSlug está correto
- Confirme que a chamada à API está funcionando (DevTools > Network)

## 📝 Validações

### Criar/Editar Cargo
- **Nome**: Obrigatório, 1-100 caracteres
- **Descrição**: Opcional

### Atribuir Cargo
- **Cargo**: Obrigatório
- **Dias de Trabalho**: Mínimo 1 dia

## 🚀 Próximos Passos Sugeridos

1. Adicionar exibição do cargo atual na tabela de membros
2. Implementar filtros e busca na página de cargos
3. Criar dashboard com estatísticas de alocação
4. Adicionar histórico de mudanças de cargo
5. Implementar permissões baseadas em roles

---

**Status**: ✅ Implementação Completa
**Arquivos**: 15 criados/modificados
**Data**: 2025-10-19
