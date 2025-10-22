# Como Adicionar o Atalho do TV Display no Dashboard

## 📍 Localização Sugerida

O componente `TVDisplayShortcut` pode ser adicionado em várias páginas:

1. **Dashboard principal da unidade**
2. **Página de configurações**
3. **Sidebar/Menu lateral**
4. **Página de demandas**

## 🎯 Exemplo de Integração

### Opção 1: No Dashboard Principal

```tsx
// src/app/(app)/org/[org]/unit/[unit]/page.tsx
import { TVDisplayShortcut } from '@/components/tv-display-shortcut'
import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'

export default async function UnitDashboard() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Grid com cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card de Estatísticas */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
          {/* Conteúdo */}
        </div>

        {/* Card do TV Display */}
        <TVDisplayShortcut 
          organizationSlug={currentOrg!} 
          unitSlug={currentUnit!} 
        />

        {/* Outros cards */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          {/* Conteúdo */}
        </div>
      </div>
    </div>
  )
}
```

### Opção 2: Na Página de Demandas

```tsx
// src/app/(app)/org/[org]/unit/[unit]/demands/page.tsx
import { TVDisplayShortcut } from '@/components/tv-display-shortcut'
import { getCurrentOrg, getCurrentUnit } from '@/lib/auth'

export default async function DemandsPage() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Demandas</h1>
        <div className="flex gap-4">
          {/* Botões de ação */}
        </div>
      </div>

      {/* Banner do TV Display */}
      <div className="max-w-md">
        <TVDisplayShortcut 
          organizationSlug={currentOrg!} 
          unitSlug={currentUnit!} 
        />
      </div>

      {/* Lista de demandas */}
      <div className="bg-white rounded-2xl shadow">
        {/* Tabela de demandas */}
      </div>
    </div>
  )
}
```

### Opção 3: No Menu/Sidebar

```tsx
// src/components/sidebar.tsx
'use client'

import Link from 'next/link'
import { Monitor, Home, Users, FileText } from 'lucide-react'
import { useParams } from 'next/navigation'

export function Sidebar() {
  const params = useParams()
  const org = params.org as string
  const unit = params.unit as string

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen p-4">
      <nav className="space-y-2">
        <Link 
          href={`/org/${org}/unit/${unit}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link 
          href={`/org/${org}/unit/${unit}/demands`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <FileText className="h-5 w-5" />
          <span>Demandas</span>
        </Link>

        <Link 
          href={`/org/${org}/unit/${unit}/members`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <Users className="h-5 w-5" />
          <span>Equipe</span>
        </Link>

        {/* Separador */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Link do TV Display com destaque */}
        <Link 
          href={`/org/${org}/unit/${unit}/tv-display`}
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <Monitor className="h-5 w-5" />
          <span className="font-semibold">Display TV</span>
        </Link>
      </nav>
    </aside>
  )
}
```

### Opção 4: Banner Superior (Header)

```tsx
// src/components/header.tsx
'use client'

import { Monitor, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function Header() {
  const params = useParams()
  const org = params.org as string
  const unit = params.unit as string

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Equipe Ativa</h1>
          </div>

          {/* TV Display Banner - Compacto */}
          <Link
            href={`/org/${org}/unit/${unit}/tv-display`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <Monitor className="h-4 w-4" />
            <span>Abrir Display TV</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          {/* Outros elementos do header */}
          <div className="flex items-center gap-4">
            {/* Avatar, notificações, etc */}
          </div>
        </div>
      </div>
    </header>
  )
}
```

### Opção 5: Modal/Dialog de Acesso Rápido

```tsx
// src/components/quick-access-dialog.tsx
'use client'

import { useState } from 'react'
import { Monitor, Zap } from 'lucide-react'
import { TVDisplayShortcut } from './tv-display-shortcut'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface QuickAccessDialogProps {
  organizationSlug: string
  unitSlug: string
}

export function QuickAccessDialog({ organizationSlug, unitSlug }: QuickAccessDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-50">
          <Zap className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Acesso Rápido
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <TVDisplayShortcut 
            organizationSlug={organizationSlug}
            unitSlug={unitSlug}
          />
          {/* Outros atalhos podem ser adicionados aqui */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## 🎨 Variações de Estilo

### Versão Compacta

```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Monitor className="h-5 w-5 text-blue-600" />
      <div>
        <p className="font-semibold text-sm text-slate-900">Display da Recepção</p>
        <p className="text-xs text-slate-600">Chamada de pacientes</p>
      </div>
    </div>
    <Link
      href={`/org/${org}/unit/${unit}/tv-display`}
      target="_blank"
      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
    >
      Abrir
    </Link>
  </div>
</div>
```

### Versão Card Grande

```tsx
<div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl">
  <div className="flex items-start gap-6">
    <div className="bg-white/20 p-4 rounded-2xl">
      <Monitor className="h-12 w-12" />
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-2">Display da Recepção</h3>
      <p className="text-blue-100 mb-4">
        Tela de chamada de pacientes em tempo real. 
        Atualizações automáticas a cada 3 segundos.
      </p>
      <Link
        href={`/org/${org}/unit/${unit}/tv-display`}
        target="_blank"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
      >
        <ExternalLink className="h-5 w-5" />
        Abrir Display em Nova Aba
      </Link>
    </div>
  </div>
</div>
```

## 🔧 Personalização

### Com Informações de Status

```tsx
'use client'

import { useEffect, useState } from 'react'
import { TVDisplayShortcut } from './tv-display-shortcut'
import { getRecentCalls } from '@/http/get-recent-calls'

export function TVDisplayWithStatus({ organizationSlug, unitSlug }) {
  const [activeCallsCount, setActiveCallsCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const { calls } = await getRecentCalls({ organizationSlug, unitSlug })
      setActiveCallsCount(calls.length)
    }
    
    fetchCount()
    const interval = setInterval(fetchCount, 10000) // Atualiza a cada 10s
    
    return () => clearInterval(interval)
  }, [organizationSlug, unitSlug])

  return (
    <div className="space-y-2">
      <TVDisplayShortcut 
        organizationSlug={organizationSlug}
        unitSlug={unitSlug}
      />
      {activeCallsCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 text-center">
            🔔 {activeCallsCount} {activeCallsCount === 1 ? 'paciente sendo chamado' : 'pacientes sendo chamados'}
          </p>
        </div>
      )}
    </div>
  )
}
```

## 📱 Responsividade

### Desktop e Mobile

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Desktop: Card normal */}
  <div className="hidden md:block">
    <TVDisplayShortcut 
      organizationSlug={org}
      unitSlug={unit}
    />
  </div>

  {/* Mobile: Versão compacta */}
  <div className="md:hidden">
    <Link
      href={`/org/${org}/unit/${unit}/tv-display`}
      target="_blank"
      className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div className="flex items-center gap-3">
        <Monitor className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-sm">Display TV</span>
      </div>
      <ExternalLink className="h-4 w-4 text-blue-600" />
    </Link>
  </div>
</div>
```

## 🎯 Recomendações

### Onde Colocar?

✅ **Recomendado:**
- Dashboard principal (alta visibilidade)
- Página de demandas (contexto relevante)
- Menu lateral (acesso fácil)

⚠️ **Não Recomendado:**
- Página de perfil de usuário
- Configurações avançadas
- Páginas específicas de paciente

### Prioridade de Exibição

1. 🥇 **Dashboard** - Primeiro lugar que os usuários veem
2. 🥈 **Menu lateral** - Sempre acessível
3. 🥉 **Página de demandas** - Contexto relacionado

---

**💡 Dica:** Comece com o dashboard e depois expanda para outras áreas conforme necessário!
