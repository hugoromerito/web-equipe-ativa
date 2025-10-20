# Sistema de Agendamento - Documentação Completa

## 📋 Visão Geral

Sistema de agendamento integrado ao formulário de criação de demandas, permitindo seleção de cargo profissional e visualização de disponibilidade em formato de agenda semanal.

## 🎯 Funcionalidades Implementadas

### 1. Seleção de Cargo (Job Title)
- ✅ Componente com checkboxes para selecionar cargo
- ✅ Exibição de nome e descrição do cargo
- ✅ Apenas um cargo pode ser selecionado por vez
- ✅ Visual destacado para cargo selecionado

### 2. Agenda de Disponibilidade (Time Slot Grid)
- ✅ Grid com datas (7 dias) nas colunas
- ✅ Horários em intervalos de 30 minutos (8h-18h) nas linhas
- ✅ Navegação entre semanas (anterior/próxima/atual)
- ✅ Slots coloridos por disponibilidade:
  - 🟢 Verde: Disponível
  - ⚪ Cinza: Indisponível
  - 🔵 Azul: Selecionado
- ✅ Tooltip ao passar mouse mostrando profissionais disponíveis
- ✅ Badge com contador de profissionais em cada slot
- ✅ Lista de profissionais disponíveis abaixo da agenda

### 3. Integração com Formulário
- ✅ Remoção completa dos campos de endereço
- ✅ Campos hidden para dados de agendamento (memberId, date, startTime, endTime)
- ✅ Botão desabilitado até selecionar um horário
- ✅ Validação antes de submeter

## 📁 Estrutura de Arquivos

### HTTP Functions
```
src/http/
  └── get-member-availability.ts    # Busca disponibilidade dos membros por cargo
```

### Hooks
```
src/hooks/
  └── use-availability.ts           # Hook para gerenciar busca de disponibilidade
```

### Components
```
src/components/
  ├── job-title-selector.tsx        # Seletor de cargo com checkboxes
  └── time-slot-grid.tsx            # Grade de horários com disponibilidade
```

### Pages
```
src/app/(app)/org/[org]/unit/[unit]/applicant/[applicant]/create-demand/
  ├── page.tsx                      # Página principal (Server Component)
  └── create-demand-form.tsx        # Formulário com agendamento (Client Component)
```

## 🔌 API Endpoints

### GET /organizations/:org/units/:unit/members/availability

Busca disponibilidade dos membros por cargo.

**Query Parameters:**
```typescript
{
  jobTitleId: string    // ID do cargo
  startDate: string     // Data inicial (ISO: yyyy-MM-dd)
  endDate: string       // Data final (ISO: yyyy-MM-dd)
}
```

**Response:**
```typescript
{
  members: [
    {
      memberId: string
      memberName: string
      avatarUrl: string | null
      email: string
      availability: [
        {
          memberId: string
          memberName: string
          date: string          // ISO date
          startTime: string     // HH:mm
          endTime: string       // HH:mm
          isAvailable: boolean
        }
      ]
    }
  ]
}
```

## 💻 Uso dos Componentes

### JobTitleSelector

```tsx
import { JobTitleSelector } from '@/components/job-title-selector'

<JobTitleSelector
  jobTitles={jobTitles}
  selectedJobTitleId={selectedJobTitleId}
  onJobTitleSelect={setSelectedJobTitleId}
  isLoading={isLoadingJobTitles}
/>
```

**Props:**
- `jobTitles`: Array de objetos JobTitle
- `selectedJobTitleId`: ID do cargo selecionado (string | null)
- `onJobTitleSelect`: Callback ao selecionar cargo
- `isLoading`: Estado de carregamento (opcional)

### TimeSlotGrid

```tsx
import { TimeSlotGrid } from '@/components/time-slot-grid'

<TimeSlotGrid
  availability={availabilityData?.members || []}
  isLoading={isLoadingAvailability}
  onSlotSelect={handleSlotSelect}
  selectedSlot={selectedSlot}
/>
```

**Props:**
- `availability`: Array de MemberAvailability
- `isLoading`: Estado de carregamento (opcional)
- `onSlotSelect`: Callback ao selecionar slot
- `selectedSlot`: Slot selecionado (objeto com memberId, date, startTime, endTime)

## 🎨 Fluxo de Uso

### Para o Usuário

1. **Preencher dados básicos**
   - Título da consulta
   - Descrição da solicitação

2. **Selecionar cargo**
   - Marcar checkbox do cargo desejado
   - Apenas um cargo pode ser selecionado

3. **Visualizar disponibilidade**
   - Após selecionar cargo, a agenda é carregada
   - Ver horários disponíveis em verde
   - Navegar entre semanas se necessário

4. **Selecionar horário**
   - Clicar em um slot verde (disponível)
   - Slot fica azul quando selecionado
   - Ver nome do profissional no tooltip

5. **Registrar consulta**
   - Botão habilitado após selecionar horário
   - Submeter formulário

### Para o Desenvolvedor

```typescript
// 1. Importar hooks
import { useJobTitles } from '@/hooks/use-job-titles'
import { useAvailability } from '@/hooks/use-availability'

// 2. Obter parâmetros da URL
const params = useParams<{ org: string; unit: string }>()

// 3. Estados
const [selectedJobTitleId, setSelectedJobTitleId] = useState<string | null>(null)
const [selectedSlot, setSelectedSlot] = useState<{
  memberId: string
  date: string
  startTime: string
  endTime: string
} | null>(null)

// 4. Buscar cargos
const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(params.org)

// 5. Buscar disponibilidade (quando cargo selecionado)
const { data: availabilityData, isLoading: isLoadingAvailability } = useAvailability({
  organizationSlug: params.org,
  unitSlug: params.unit,
  jobTitleId: selectedJobTitleId,
  enabled: !!selectedJobTitleId,
})

// 6. Handler para seleção de slot
const handleSlotSelect = (
  memberId: string, 
  date: string, 
  startTime: string, 
  endTime: string
) => {
  setSelectedSlot({ memberId, date, startTime, endTime })
}

// 7. Incluir dados no formulário
{selectedSlot && (
  <>
    <input type="hidden" name="memberId" value={selectedSlot.memberId} />
    <input type="hidden" name="date" value={selectedSlot.date} />
    <input type="hidden" name="startTime" value={selectedSlot.startTime} />
    <input type="hidden" name="endTime" value={selectedSlot.endTime} />
  </>
)}
```

## 🎯 Configurações da Agenda

### Horários
- **Início:** 08:00
- **Fim:** 18:00
- **Intervalo:** 30 minutos
- **Total de slots:** 21 slots por dia

### Período de Visualização
- **Padrão:** Semana atual (domingo a sábado)
- **Navegação:** Semanas anterior e próxima
- **Período de busca:** Semana atual + 2 semanas (21 dias)

## 🔄 Estados do Slot

| Estado | Cor | Descrição |
|--------|-----|-----------|
| Disponível | Verde | Pelo menos um profissional livre |
| Indisponível | Cinza | Nenhum profissional livre |
| Selecionado | Azul | Slot escolhido pelo usuário |

## 📊 Tipos TypeScript

### MemberAvailability
```typescript
interface MemberAvailability {
  memberId: string
  memberName: string
  avatarUrl: string | null
  email: string
  availability: TimeSlot[]
}
```

### TimeSlot
```typescript
interface TimeSlot {
  memberId: string
  memberName: string
  date: string          // ISO format: yyyy-MM-dd
  startTime: string     // HH:mm format
  endTime: string       // HH:mm format
  isAvailable: boolean
}
```

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Filtro por membro específico
- [ ] Visualização mensal
- [ ] Exportar agenda em PDF
- [ ] Notificações de agendamento

### Médio Prazo
- [ ] Recorrência de agendamentos
- [ ] Conflito de horários automático
- [ ] Integração com calendário externo (Google Calendar)
- [ ] Sistema de lembretes

### Longo Prazo
- [ ] Machine Learning para sugestão de horários
- [ ] Analytics de utilização
- [ ] Multi-idioma
- [ ] App mobile dedicado

## 🐛 Troubleshooting

### Agenda não carrega
- ✅ Verificar se cargo foi selecionado
- ✅ Confirmar que `selectedJobTitleId` não é null
- ✅ Verificar console para erros de API

### Slots não aparecem disponíveis
- ✅ Confirmar que membros têm o cargo atribuído
- ✅ Verificar working days dos membros
- ✅ Validar período de busca (startDate/endDate)

### Erro ao selecionar slot
- ✅ Verificar se `onSlotSelect` está definido
- ✅ Confirmar tipos dos parâmetros (string, string, string, string)

## 📝 Exemplo Completo

```tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useJobTitles } from '@/hooks/use-job-titles'
import { useAvailability } from '@/hooks/use-availability'
import { JobTitleSelector } from '@/components/job-title-selector'
import { TimeSlotGrid } from '@/components/time-slot-grid'

export function SchedulingForm() {
  const params = useParams<{ org: string; unit: string }>()
  const [selectedJobTitleId, setSelectedJobTitleId] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const { jobTitles, isLoading: isLoadingJobTitles } = useJobTitles(params.org)
  
  const { data: availabilityData, isLoading: isLoadingAvailability } = useAvailability({
    organizationSlug: params.org,
    unitSlug: params.unit,
    jobTitleId: selectedJobTitleId,
    enabled: !!selectedJobTitleId,
  })

  return (
    <div className="space-y-6">
      <JobTitleSelector
        jobTitles={jobTitles}
        selectedJobTitleId={selectedJobTitleId}
        onJobTitleSelect={setSelectedJobTitleId}
        isLoading={isLoadingJobTitles}
      />

      {selectedJobTitleId && (
        <TimeSlotGrid
          availability={availabilityData?.members || []}
          isLoading={isLoadingAvailability}
          onSlotSelect={(memberId, date, startTime, endTime) => 
            setSelectedSlot({ memberId, date, startTime, endTime })
          }
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  )
}
```

## 📚 Referências

- [React Query Documentation](https://tanstack.com/query/latest)
- [date-fns Documentation](https://date-fns.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Última atualização:** 19 de outubro de 2025
**Versão:** 1.0.0
**Autor:** Sistema de Agendamento - Equipe Ativa
