'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMediaQuery } from '@/hooks/use-media-query'
import { DialogTitle } from '../ui/dialog'
import { 
  type DemandStatusType, 
  getNextPossibleStatuses, 
  STATUS_OPTIONS 
} from '@/constants/demand-translations'

type Status = {
  value: string
  label: string
}

interface ComboBoxStatusProps {
  id: string
  name: string
  currentStatus?: DemandStatusType
}

export function ComboBoxStatus({ id, name, currentStatus }: ComboBoxStatusProps) {
  // Filtra as opções de status baseado nas transições válidas
  const statusOptions: Status[] = React.useMemo(() => {
    if (!currentStatus) {
      // Se não há status atual, mostra todas as opções (fallback)
      return STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: `${opt.icon} ${opt.label}`
      }))
    }

    // Obtém os próximos status possíveis baseado no status atual
    const nextStatuses = getNextPossibleStatuses(currentStatus)
    
    // Filtra e formata as opções
    return STATUS_OPTIONS
      .filter(opt => nextStatuses.includes(opt.value))
      .map(opt => ({
        value: opt.value,
        label: `${opt.icon} ${opt.label}`
      }))
  }, [currentStatus])
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  )

  return (
    <>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedStatus?.value || ''}
      />

      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 hover:border-primary/50 hover:from-white hover:to-white transition-all duration-200"
            >
              <span className={selectedStatus ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                {selectedStatus ? selectedStatus.label : 'Selecionar status'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 pointer-events-auto" align="center" sideOffset={8}>
            <StatusList
              statusOptions={statusOptions}
              setOpen={setOpen}
              setSelectedStatus={setSelectedStatus}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DialogTitle hidden>Status</DialogTitle>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 hover:border-primary/50 hover:from-white hover:to-white transition-all duration-200"
            >
              <span className={selectedStatus ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                {selectedStatus ? selectedStatus.label : 'Selecionar status'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <StatusList
                statusOptions={statusOptions}
                setOpen={setOpen}
                setSelectedStatus={setSelectedStatus}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function StatusList({
  statusOptions,
  setOpen,
  setSelectedStatus,
}: {
  statusOptions: Status[]
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command className="rounded-lg border-0 shadow-md" shouldFilter={true}>
      <CommandInput 
        placeholder="Buscar status..." 
        className="h-12 border-b"
      />
      <CommandList className="max-h-[300px]">
        <CommandEmpty className="py-6 text-center text-sm text-slate-500">
          Nenhum status encontrado.
        </CommandEmpty>
        <CommandGroup className="p-2">
          {statusOptions.map((status) => (
            <CommandItem
              key={status.value}
              value={status.label}
              keywords={[status.value]}
              onSelect={() => {
                setSelectedStatus(status)
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-lg hover:bg-slate-100 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
            >
              <span className="text-base">{status.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
