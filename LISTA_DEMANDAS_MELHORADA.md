# Lista de Demandas - Modo Lista por Padrão + Grid Opcional

## 🎯 Objetivo

Redesenhar a página de lista de demandas para ter **modo lista como padrão** (mais profissional e escaneável) com **opção de visualização em grid**, além de melhorar significativamente o layout e informações no modo lista.

---

## ✨ Principais Mudanças

### 1. **Modo Padrão Alterado**

```tsx
// ANTES
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

// DEPOIS
const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
```

✅ **Lista é agora o modo padrão**

### 2. **Ordem dos Botões de Visualização**

```tsx
// ANTES: Grid primeiro, Lista segundo
<button onClick={() => setViewMode('grid')}>Grid</button>
<button onClick={() => setViewMode('list')}>List</button>

// DEPOIS: Lista primeiro, Grid segundo
<button onClick={() => setViewMode('list')}>List</button>
<button onClick={() => setViewMode('grid')}>Grid</button>
```

✅ **Lista aparece primeiro** (destaque no modo padrão)

---

## 🎨 Novo Design do Modo Lista

### **Layout Horizontal Elegante e Profissional**

#### Estrutura Geral:
```
┌─────────────────────────────────────────────────────────────┐
│  [Ícone 16x16]  [Conteúdo Principal]      [Badges Lateral] │
│                                                               │
│                 • Título (text-xl bold)                       │
│                 • Categoria                                   │
│                 • Descrição (2 linhas)                        │
│                 • Grid 3 colunas (Paciente, Resp., Agendam.) │
└─────────────────────────────────────────────────────────────┘
```

### **Características do Modo Lista:**

#### 1. **Card Container:**
```tsx
<div className="group rounded-2xl border-l-4 {statusBorderColor} bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
  <div className="p-6">
    {/* Conteúdo em layout horizontal */}
  </div>
</div>
```

**Melhorias:**
- ✅ `rounded-2xl` (mais suave)
- ✅ `border-l-4` (mais sutil que 6px)
- ✅ `p-6` (padding generoso)
- ✅ Animação de delay reduzida: `30ms` (antes `50ms`)

#### 2. **Ícone da Categoria - Mais Destaque:**
```tsx
<div className="w-16 h-16 rounded-2xl bg-gradient-to-br {category.color} flex items-center justify-center text-white text-2xl shadow-lg">
  {category.icon}
</div>
```

**Mudanças:**
- ✅ Tamanho: `16x16` (era `11x11` no grid) - **45% maior**
- ✅ `rounded-2xl` (mais suave)
- ✅ `text-2xl` (ícone maior)
- ✅ `shadow-lg` (mais elevação)

#### 3. **Título e Categoria:**
```tsx
<h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
  {demand.title}
</h3>
<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
  {category.label}
</p>
```

**Melhorias:**
- ✅ Título: `text-xl` (era `text-base`) - **25% maior**
- ✅ Sem `line-clamp-1` - título completo visível
- ✅ Melhor hierarquia visual

#### 4. **Descrição:**
```tsx
<p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
  {demand.description}
</p>
```

**Mantém:**
- ✅ 2 linhas visíveis
- ✅ `leading-relaxed` para legibilidade

#### 5. **Grid de Informações (3 Colunas):**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-2">
  {/* Paciente */}
  {/* Responsável (se houver) */}
  {/* Agendamento (se houver) */}
</div>
```

##### **Card do Paciente:**
```tsx
<div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-xl border border-slate-100">
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
    <User size={18} className="text-emerald-700" />
  </div>
  <div>
    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Paciente</p>
    <p className="text-sm font-bold text-slate-900 truncate">{demand.location}</p>
  </div>
</div>
```

**Melhorias:**
- ✅ `px-4 py-3` (mais espaçoso que `px-3 py-2.5`)
- ✅ `rounded-xl` (mais suave)
- ✅ Ícone `10x10` com gradiente suave
- ✅ Ícone `size={18}` (maior)
- ✅ Nome com `font-bold text-sm` (destaque)

##### **Card do Responsável:**
```tsx
<div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-100">
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
    <span className="text-sm font-bold text-white">
      {demand.responsible.name.charAt(0).toUpperCase()}
    </span>
  </div>
  <div>
    <p className="text-[10px] text-blue-600 font-semibold uppercase">Responsável</p>
    <p className="text-sm font-bold text-blue-900 truncate">{demand.responsible.name}</p>
    <p className="text-[10px] text-blue-600/70 truncate">{demand.responsible.jobTitle}</p>
  </div>
</div>
```

**Melhorias:**
- ✅ Avatar maior `10x10` (era `7x7`)
- ✅ Gradiente forte (azul 500-600)
- ✅ `shadow-md` no avatar
- ✅ Nome com `font-bold text-sm`
- ✅ Job title mantido

##### **Card do Agendamento:**
```tsx
<div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-50/50 rounded-xl border border-purple-100">
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
    <Calendar size={18} className="text-white" />
  </div>
  <div>
    <p className="text-[10px] text-purple-600 font-semibold uppercase">Agendamento</p>
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-purple-900">DD/MMM</span>
      <span className="text-purple-400">•</span>
      <span className="text-sm font-bold text-purple-900">HH:MM</span>
    </div>
  </div>
</div>
```

**Melhorias:**
- ✅ Ícone maior `10x10`
- ✅ Tema roxo (diferente do azul)
- ✅ Data e hora com `font-bold text-sm`
- ✅ Separador `•` mais visível

#### 6. **Badges Lateral (Status, Prioridade, Urgência):**

```tsx
<div className="flex flex-col items-end gap-2 flex-shrink-0">
  {/* Status Badge */}
  <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-sm border-2">
    {status.label}
  </span>
  
  {/* Priority Badge */}
  <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-sm border-2">
    {priority.label}
  </span>

  {/* Urgency Indicator */}
  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full {color} animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full {color} opacity-60" />
    </div>
    <span className="text-xs font-bold {color}">
      {demand.urgency}%
    </span>
  </div>

  {/* Info Criação */}
  <div className="text-[11px] text-slate-400 text-right mt-4">
    <div>• Autor</div>
    <div>• Data</div>
  </div>
</div>
```

**Melhorias:**
- ✅ Badges maiores: `px-4 py-2` (eram `px-3 py-1`)
- ✅ `rounded-xl` (mais suave)
- ✅ `font-bold` (mais destaque)
- ✅ `shadow-sm` adicionado
- ✅ `border-2` (borda mais forte)
- ✅ Porcentagem de urgência visível
- ✅ Info de criação posicionada embaixo

#### 7. **ChevronRight:**
```tsx
<ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0 mt-1" size={24} />
```

**Melhorias:**
- ✅ `size={24}` (maior que no grid)
- ✅ `translate-x-2` (mais movimento)
- ✅ Posição no topo direito

---

## 📊 Comparação: Modo Lista vs Modo Grid

| Aspecto | Modo Lista | Modo Grid |
|---------|-----------|-----------|
| **Layout** | Horizontal (flexbox) | Vertical (coluna) |
| **Ícone Categoria** | `16x16` | `11x11` |
| **Título** | `text-xl` sem clamp | `text-base` com clamp-1 |
| **Descrição** | 2 linhas | 2 linhas |
| **Informações** | Grid 3 colunas horizontais | Verticais empilhadas |
| **Paciente Card** | `px-4 py-3`, avatar 10x10 | `px-3 py-2.5`, avatar 8x8 |
| **Responsável** | Avatar 10x10 visível inline | Avatar 7x7 em bloco |
| **Agendamento** | Avatar 10x10 inline | Avatar 7x7 em bloco |
| **Badges** | Lateral, maiores (`px-4 py-2`) | Abaixo descrição, menores |
| **Urgência** | % visível | Apenas indicador |
| **ChevronRight** | `size={24}` | `size={22}` |
| **Info Criação** | Lateral direita embaixo | Footer inline |
| **Altura** | Auto (mais compacto) | `h-full` (cards iguais) |
| **Responsivo** | Grid cols: `1 lg:3` | Grid layout: `1 md:2 xl:3` |

---

## 🎨 Paleta de Cores no Modo Lista

### Gradientes Suaves:
- **Paciente**: `from-emerald-100 to-emerald-200` + `text-emerald-700`
- **Responsável**: `from-blue-500 to-blue-600` (avatar) + `text-blue-900` (nome)
- **Agendamento**: `from-purple-500 to-purple-600` (avatar) + `text-purple-900` (texto)

### Backgrounds dos Cards:
- **Paciente**: `from-slate-50 to-slate-50/50`
- **Responsável**: `from-blue-50 to-blue-50/50` + `border-blue-100`
- **Agendamento**: `from-purple-50 to-purple-50/50` + `border-purple-100`

### Badges:
Mesma paleta do modo grid, mas maiores e com `border-2`

---

## 📐 Espaçamentos no Modo Lista

| Elemento | Padding/Gap |
|----------|-------------|
| **Card Container** | `p-6` |
| **Flex Principal** | `gap-6` |
| **Conteúdo** | `space-y-3` |
| **Grid Info** | `gap-3` |
| **Cards Internos** | `px-4 py-3` |
| **Badges Lateral** | `gap-2` |

---

## ✨ Animações e Transições

### Entrada dos Cards:
```tsx
style={{ animationDelay: `${index * 30}ms` }}
```
✅ Delay reduzido para `30ms` (era `50ms`) - mais rápido

### Hover States:
- ✅ `hover:shadow-xl` no card
- ✅ `group-hover:text-primary` no título
- ✅ `group-hover:translate-x-2` no ChevronRight (mais movimento)
- ✅ `transition-all duration-300`

---

## 📱 Responsividade

### Grid de Informações:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
```

**Comportamento:**
- **Mobile/Tablet** (`< lg`): 1 coluna (vertical)
- **Desktop** (`>= lg`): 3 colunas (horizontal)

### Container Principal:
```tsx
<div className={`grid gap-6 ${viewMode === 'grid' 
  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
  : 'grid-cols-1'
}`}>
```

**Comportamento:**
- **Lista**: Sempre 1 coluna (full width)
- **Grid**: Responsivo (1, 2, ou 3 colunas)

---

## 🚀 Benefícios do Novo Design

### Modo Lista:

1. **✅ Mais Escaneável**
   - Layout horizontal facilita leitura
   - Informações importantes em destaque
   - Badges laterais fáceis de identificar

2. **✅ Mais Informação Visível**
   - Título completo (sem clamp)
   - Ícone maior e mais visível
   - Grid mostra até 3 informações simultaneamente
   - % de urgência visível

3. **✅ Melhor Hierarquia**
   - Ícone 16x16 chama atenção
   - Título xl em destaque
   - Cards coloridos diferenciam tipos de info
   - Badges organizados lateralmente

4. **✅ Mais Profissional**
   - Gradientes sutis e elegantes
   - Avatares com sombras
   - Borders mais fortes nos badges
   - Espaçamentos generosos

5. **✅ Mais Eficiente**
   - Menos scroll vertical necessário
   - Comparação rápida entre demandas
   - Informações críticas sempre visíveis

### Alternância de Modos:

1. **✅ Lista (Padrão)**
   - Para trabalho profissional
   - Análise detalhada
   - Triagem rápida

2. **✅ Grid (Opcional)**
   - Visão geral rápida
   - Muitas demandas
   - Preferência visual

---

## 📝 Código Comparativo

### Renderização Condicional:
```tsx
{demands.map((demand, index) => {
  // Traduções e cores...
  
  if (viewMode === 'list') {
    // MODO LISTA - Layout horizontal elegante
    return (
      <Link>
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Ícone grande */}
            {/* Conteúdo principal */}
            {/* Badges lateral */}
          </div>
        </div>
      </Link>
    )
  }

  // MODO GRID - Layout vertical original
  return (
    <Link>
      <div>
        {/* Header */}
        {/* Body */}
      </div>
    </Link>
  )
})}
```

---

## 🎯 Casos de Uso

### Quando usar **Modo Lista**:
- ✅ Análise detalhada de demandas
- ✅ Comparação entre múltiplas demandas
- ✅ Trabalho profissional diário
- ✅ Triagem e priorização
- ✅ Desktop/telas grandes

### Quando usar **Modo Grid**:
- ✅ Visão geral rápida
- ✅ Muitas demandas para ver
- ✅ Preferência por cards verticais
- ✅ Trabalho em tablet
- ✅ Overview rápido

---

## 📄 Arquivos Modificados

**Localização**: `src/app/(app)/org/[org]/unit/[unit]/demands/demand-list.tsx`

**Linhas**: ~950 linhas (aumentou ~100 linhas com novo modo lista)

**Data**: 19/10/2025

---

✅ **Implementação Completa** - A lista de demandas agora tem um design profissional em modo lista por padrão, com layout horizontal elegante, informações mais visíveis, e opção de grid quando necessário!
