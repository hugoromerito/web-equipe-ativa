'use client'

import { Monitor, Moon, Sun, Check } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme, isDark, isLight, isSystem, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button size={'icon'} variant={'ghost'} disabled>
        <Sun className="size-4" />
        <span className="sr-only">Carregando tema...</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size={'icon'} 
          variant={'ghost'}
          className="relative overflow-hidden transition-all duration-300 hover:bg-accent/80"
        >
          <div className="relative">
            <Sun className={cn(
              "size-4 transition-all duration-300 rotate-0 scale-100",
              isDark && "rotate-90 scale-0"
            )} />
            <Moon className={cn(
              "absolute top-0 left-0 size-4 transition-all duration-300 rotate-90 scale-0",
              isDark && "rotate-0 scale-100"
            )} />
          </div>
          <span className="sr-only">
            Alternar tema - Atual: {theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Escuro' : 'Claro'}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 p-2">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Tema da Aplicação
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors",
            theme === 'light' && "bg-accent text-accent-foreground"
          )}
        >
          <Sun className="size-4" />
          <span className="flex-1">Claro</span>
          {theme === 'light' && <Check className="size-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors",
            theme === 'dark' && "bg-accent text-accent-foreground"
          )}
        >
          <Moon className="size-4" />
          <span className="flex-1">Escuro</span>
          {theme === 'dark' && <Check className="size-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors",
            theme === 'system' && "bg-accent text-accent-foreground"
          )}
        >
          <Monitor className="size-4" />
          <div className="flex-1">
            <div>Sistema</div>
            <div className="text-xs text-muted-foreground">
              {resolvedTheme === 'dark' ? 'Escuro' : 'Claro'} (auto)
            </div>
          </div>
          {theme === 'system' && <Check className="size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
