'use client'

import { Menu, Building2, FileText, Eye, Users, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function MobileMenu() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="size-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/units" className="flex items-center gap-2">
            <Building2 className="size-4" />
            Setores
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/demands/create" className="flex items-center gap-2">
            <FileText className="size-4" />
            Registrar Consultas
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/demands" className="flex items-center gap-2">
            <Eye className="size-4" />
            Visualizar Consultas
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/members" className="flex items-center gap-2">
            <Users className="size-4" />
            Visualizar Membros
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
          <Sun className="size-4" />
          Tema Claro
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
          <Moon className="size-4" />
          Tema Escuro
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
          <Sun className="size-4" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}