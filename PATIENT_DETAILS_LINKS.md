# Links para Página de Detalhes do Paciente

## 📋 Resumo

Adicionados links clicáveis para visualizar os detalhes completos do paciente em duas páginas principais:
1. **Lista de Pacientes** (`/patients`)
2. **Detalhes da Demand** (`/demands/[id]`)

---

## ✅ Mudanças Implementadas

### 1. Página de Detalhes da Demand (`demand-details.tsx`)

**Localização:** `src/app/.../demands/[demands]/demand-details.tsx`

**Adicionado:**
- ✅ Botão "Ver perfil" ao lado do botão WhatsApp
- ✅ Ícone `Eye` (olho)
- ✅ Design consistente com o botão WhatsApp
- ✅ Responsivo (esconde texto em mobile, mantém ícone)

**Código:**
```tsx
<Link
  href={`/org/${currentOrg}/unit/${currentUnit}/applicant/${demand.applicant.id}/info`}
  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 hover:shadow-md transition-all duration-200"
>
  <Eye className="h-4 w-4" />
  <span className="hidden sm:inline">Ver perfil</span>
</Link>
```

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ 👤 Paciente                                     │
│ ┌─────┐                                         │
│ │  J  │ João Silva                              │
│ └─────┘ 01/01/1990 • (11) 98765-4321           │
│         👁️ Ver perfil  💬 WhatsApp              │
└─────────────────────────────────────────────────┘
```

---

### 2. Página de Lista de Pacientes (`patients-list.tsx`)

**Localização:** `src/app/.../patients/patients-list.tsx`

**Adicionado:**
- ✅ Nova coluna "Ações" na tabela
- ✅ Botão "Ver detalhes" para cada paciente
- ✅ Ícone `Eye`
- ✅ Importado componente `Link` do Next.js
- ✅ Atualizado `colSpan` para 7 no estado vazio

**Código:**
```tsx
// Importações adicionadas
import { Eye } from 'lucide-react'
import Link from 'next/link'

// Header da tabela
<TableHead className="font-semibold text-slate-900 text-center">Ações</TableHead>

// Célula de ações
<TableCell className="text-center">
  <Link
    href={`/org/${organizationSlug}/unit/default/applicant/${patient.id}/info`}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:shadow-sm transition-all duration-200"
  >
    <Eye className="h-3.5 w-3.5" />
    Ver detalhes
  </Link>
</TableCell>
```

**Visual da Tabela:**
```
┌──────────┬──────┬───────┬──────────┬─────────────┬────────────┬──────────────┐
│ Nome     │ CPF  │ Idade │ Contato  │ Observações │ Cadastrado │ Ações        │
├──────────┼──────┼───────┼──────────┼─────────────┼────────────┼──────────────┤
│ João     │ ...  │ 35    │ (11)...  │ ...         │ 01/10/2025 │ 👁️ Ver      │
│ Silva    │      │ anos  │          │             │            │   detalhes   │
└──────────┴──────┴───────┴──────────┴─────────────┴────────────┴──────────────┘
```

---

## 🎯 Rota de Destino

Ambos os links levam para a mesma página de informações do paciente:

```
/org/[org]/unit/[unit]/applicant/[applicant-id]/info
```

**Exemplos:**
```
# Da página de demands:
/org/casa-do-autista/unit/recepcao/applicant/3fa85f64-5717-4562-b3fc-2c963f66afa6/info

# Da página de patients:
/org/casa-do-autista/unit/default/applicant/3fa85f64-5717-4562-b3fc-2c963f66afa6/info
```

**Nota:** Na lista de pacientes, usamos `unit/default` pois não temos contexto de unidade específica.

---

## 🎨 Design e UX

### Botão em Demand Details
- **Cor:** Azul claro (`bg-blue-50`, `text-blue-700`)
- **Hover:** Azul mais intenso (`hover:bg-blue-100`)
- **Ícone:** `Eye` (olho)
- **Tamanho:** Médio, igual ao botão WhatsApp
- **Responsividade:** Esconde texto "Ver perfil" em mobile

### Botão em Patients List
- **Cor:** Azul claro (`bg-blue-50`, `text-blue-700`)
- **Hover:** Azul mais intenso com sombra
- **Ícone:** `Eye` (olho, menor)
- **Tamanho:** Pequeno para caber na célula
- **Alinhamento:** Centralizado na coluna

### Padrão de Cores
```
┌────────────────────────────────────────┐
│ 🔵 Azul    → Ver perfil/detalhes       │
│ 🟢 Verde   → WhatsApp (mantido)        │
│ 🟣 Roxo    → Ações principais          │
│ ⚪ Cinza   → Neutro                    │
└────────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Uso do ID como Slug
```typescript
// applicant.id é usado como slug na URL
href={`/org/${org}/unit/${unit}/applicant/${patient.id}/info`}
                                            ^^^^^^^^^^^
                                            ID como slug
```

### Tipos Atualizados
- ✅ Nenhuma alteração necessária nos tipos
- ✅ Campo `id` já existe em `demand.applicant`
- ✅ Campo `id` já existe em `patient`

---

## 📱 Responsividade

### Desktop (≥640px)
```
[👁️ Ver perfil]  [💬 WhatsApp]
```

### Mobile (<640px)
```
[👁️]  [💬]
```

Texto escondido, apenas ícones visíveis.

---

## ✅ Checklist de Validação

- [x] Link adicionado em `demand-details.tsx`
- [x] Link adicionado em `patients-list.tsx`
- [x] Importações corretas (`Link`, `Eye`)
- [x] Coluna "Ações" na tabela
- [x] `colSpan` atualizado para 7
- [x] Sem erros TypeScript
- [x] Design consistente
- [x] Hover states funcionando
- [x] Responsividade implementada

---

## 🚀 Fluxos de Navegação

### Fluxo 1: Da Lista de Demands
```
Lista de Demands
    ↓ (clica em demand)
Detalhes da Demand
    ↓ (clica "Ver perfil" no card do paciente)
Informações Completas do Paciente
```

### Fluxo 2: Da Lista de Pacientes
```
Lista de Pacientes
    ↓ (clica "Ver detalhes" na linha)
Informações Completas do Paciente
```

---

## 📝 Notas Importantes

1. **Unit "default"**: Na lista de pacientes, não temos contexto de unidade, então usamos `unit/default`. A página de info deve aceitar qualquer unidade.

2. **ID vs Slug**: O `id` do applicant é usado diretamente como slug na URL (UUID).

3. **Permissões**: Assumimos que se o usuário pode ver a demand ou a lista de pacientes, ele também pode ver os detalhes do paciente.

4. **Estado de Loading**: Os links são instantâneos (Next.js Link), sem necessidade de loading state.

---

## 🎯 Próximas Melhorias Sugeridas

1. **Breadcrumbs**: Adicionar navegação "Voltar" na página de info
2. **Tooltip**: Adicionar tooltip "Ver perfil completo" no hover
3. **Keyboard**: Garantir acessibilidade via teclado (já funciona com Link)
4. **Analytics**: Rastrear cliques nos botões "Ver perfil"
5. **Cache**: Pré-carregar dados do paciente no hover (prefetch)

---

**Status**: ✅ **Implementado e funcional**
