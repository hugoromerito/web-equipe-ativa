# 🎯 Rotas do Sistema de Cargos

## Visão Geral
Este documento lista todas as rotas disponíveis no sistema de gerenciamento de cargos.

---

## 📍 Rotas Principais

### 1. Gerenciamento de Cargos

#### **Lista de Cargos**
```
GET /org/{organizationSlug}/job-titles
```
**Descrição**: Página principal para gerenciar cargos (criar, editar, deletar)

**Funcionalidades**:
- ✅ Visualizar todos os cargos
- ✅ Criar novo cargo
- ✅ Editar cargo existente
- ✅ Deletar cargo
- ✅ Busca e filtros

**Exemplo**:
```
https://seu-site.com/org/minha-organizacao/job-titles
```

---

### 2. Atribuição de Cargos

#### **Lista de Membros (com Dialog)**
```
GET /org/{organizationSlug}/members
```
**Descrição**: Página de membros com botão para atribuir cargo via dialog

**Funcionalidades**:
- ✅ Visualizar membros
- ✅ Abrir dialog de atribuição
- ✅ Link para página dedicada

**Exemplo**:
```
https://seu-site.com/org/minha-organizacao/members
```

---

#### **Página Dedicada de Atribuição** ⭐ NEW
```
GET /org/{organizationSlug}/members/{memberId}/assign-job-title
```
**Descrição**: Página completa dedicada à atribuição de cargo

**Funcionalidades**:
- ✅ Card com informações do membro (foto, nome, email)
- ✅ Seleção de cargo com dropdown
- ✅ Preview do cargo selecionado
- ✅ Seletor de dias de trabalho com atalhos
- ✅ Validação em tempo real
- ✅ Botão voltar
- ✅ Feedback visual completo

**Exemplo**:
```
https://seu-site.com/org/minha-organizacao/members/user-123-abc/assign-job-title
```

**Vantagens**:
- URL compartilhável (deep linking)
- Interface mais espaçosa
- Melhor experiência mobile
- Informações contextuais
- Atalhos de produtividade

---

## 🔗 Estrutura de URLs

### Padrão de URLs
```
/org/{organizationSlug}/...
```

### Parâmetros
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `organizationSlug` | string | Slug único da organização | `minha-org` |
| `memberId` | string | ID único do membro | `user-123-abc` |
| `jobTitleId` | string | ID único do cargo | `job-456-def` |

---

## 🚦 Fluxos de Navegação

### Fluxo 1: Criar e Atribuir Cargo (Completo)
```
1. /org/minha-org/job-titles
   └─> Criar cargo "Médico"
   
2. /org/minha-org/members
   └─> Encontrar "João Silva"
   
3. Opção A: Click "Atribuir Cargo" (Dialog)
   └─> Atribuir no dialog
   
3. Opção B: Click ícone 🔗
   └─> /org/minha-org/members/user-123/assign-job-title
       └─> Atribuir na página dedicada
```

### Fluxo 2: Atribuição Direta (Deep Link)
```
1. Email/Notificação com link direto
   └─> /org/minha-org/members/user-123/assign-job-title
   
2. Preencher formulário
   
3. Atribuir cargo
   
4. Redirecionar para /org/minha-org/members
```

---

## 🎨 Componentes por Rota

### `/org/{org}/job-titles`
**Arquivos**:
- `page.tsx` (Server Component)
- `job-titles-list.tsx` (Client Component)

**Componentes Usados**:
- Header
- CreateJobTitleDialog
- EditJobTitleDialog
- AlertDialog (confirmação delete)
- Table
- Dropdown Menu

---

### `/org/{org}/members`
**Arquivos**:
- `page.tsx` (Client Component)

**Componentes Usados**:
- AssignJobTitleDialog
- Link para página dedicada
- Table
- Avatar
- Badge

---

### `/org/{org}/members/{member}/assign-job-title` ⭐
**Arquivos**:
- `page.tsx` (Server Component)
- `assign-job-title-form.tsx` (Client Component)

**Componentes Usados**:
- Header
- Card (Member Info)
- Card (Assignment Form)
- Avatar
- Select (Job Title)
- WeekDaysSelector
- Buttons

---

## 📱 Responsividade

Todas as rotas são responsivas:

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Stack vertical, dialogs full-width |
| Tablet (768px - 1024px) | Grid 2 colunas onde aplicável |
| Desktop (> 1024px) | Grid 3 colunas, espaçamento máximo |

---

## 🔒 Permissões (Sugerido)

**Nota**: Atualmente NÃO implementado. Adicione conforme necessário.

| Rota | Permissão Sugerida |
|------|-------------------|
| `/org/{org}/job-titles` | ADMIN, OWNER |
| `/org/{org}/job-titles` (view only) | MEMBER |
| Criar/Editar/Deletar cargo | ADMIN, OWNER |
| `/org/{org}/members/{member}/assign-job-title` | ADMIN, OWNER |
| Atribuir cargo | ADMIN, OWNER |

---

## 🎯 Links Úteis nas Páginas

### Na Página de Membros
```tsx
// Link para página dedicada
<Link href={`/org/${org}/members/${memberId}/assign-job-title`}>
  <Button variant="ghost" size="sm">
    <ExternalLink className="h-4 w-4" />
  </Button>
</Link>
```

### Na Página Dedicada
```tsx
// Botão voltar
<Button onClick={() => router.back()}>
  <ArrowLeft /> Voltar
</Button>
```

---

## 🔄 Redirecionamentos

### Após Atribuir Cargo (Página Dedicada)
```
/org/{org}/members/{member}/assign-job-title
  └─> [Sucesso] 
      └─> /org/{org}/members
```

### Após Atribuir Cargo (Dialog)
```
[Dialog fecha e permanece na mesma página]
```

---

## 📊 Comparação: Dialog vs Página Dedicada

| Característica | Dialog | Página Dedicada ⭐ |
|----------------|--------|-------------------|
| URL compartilhável | ❌ | ✅ |
| Deep linking | ❌ | ✅ |
| Espaço visual | Limitado | Amplo |
| Informações do membro | Básicas | Completas + Avatar |
| Mobile friendly | Bom | Excelente |
| Atalhos dias | ❌ | ✅ Todos/Úteis/FDS |
| Preview cargo | Básico | Detalhado |
| Navegação | Modal | Página completa |
| **Quando usar** | Atribuições rápidas | Atribuições detalhadas |

---

## 🚀 Exemplos de Uso

### Exemplo 1: URL Completa
```
https://app.equipeativa.com/org/hospital-sao-lucas/members/usr_2V3N4K5M6L7P8Q9R/assign-job-title
```

### Exemplo 2: Desenvolvimento Local
```
http://localhost:3000/org/test-org/members/user-123/assign-job-title
```

### Exemplo 3: Email com Link
```html
<a href="https://app.equipeativa.com/org/hospital-sao-lucas/members/usr_2V3N4K5M6L7P8Q9R/assign-job-title">
  Atribuir cargo para Dr. João Silva
</a>
```

---

## 📝 Próximas Rotas Sugeridas

### Visualização de Cargo Atribuído
```
GET /org/{org}/members/{member}/job-title
```
Ver o cargo atual do membro e histórico

### Edição de Cargo Atribuído
```
GET /org/{org}/members/{member}/edit-job-title
```
Editar cargo ou dias de trabalho

### Histórico de Atribuições
```
GET /org/{org}/members/{member}/job-title-history
```
Ver histórico completo de mudanças

---

## ✅ Checklist de Implementação

- [x] Rota de gerenciamento de cargos
- [x] Rota de listagem de membros
- [x] Dialog de atribuição
- [x] Página dedicada de atribuição ⭐
- [x] Links entre páginas
- [x] Redirecionamentos
- [ ] Rota de visualização de cargo
- [ ] Rota de edição de cargo
- [ ] Rota de histórico

---

**Documentação Completa**: 3 rotas principais implementadas + 1 rota nova dedicada ✨

**Última atualização**: 2025-10-19
