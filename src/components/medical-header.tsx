'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Home, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { cn } from '@/lib/utils'

interface MedicalHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  actions?: React.ReactNode
  navigation?: Array<{
    label: string
    href: string
    icon?: React.ReactNode
  }>
}

export function MedicalHeader({
  title,
  subtitle,
  showBackButton = false,
  backUrl = '/',
  actions,
  navigation = []
}: MedicalHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="medical-header sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="hover:bg-accent/80 transition-colors"
              >
                <Link href={backUrl}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Voltar</span>
                </Link>
              </Button>
            )}
            
            {title && (
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation */}
          {navigation.length > 0 && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {actions}
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        {navigation.length > 0 && (
          <div className="md:hidden border-t border-border/40 py-2">
            <nav className="flex items-center space-x-1 overflow-x-auto">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Componente de breadcrumbs para navegação hierárquica
interface BreadcrumbItem {
  label: string
  href?: string
}

interface MedicalBreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function MedicalBreadcrumbs({ 
  items, 
  separator = '/' 
}: MedicalBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-muted-foreground/60">{separator}</span>
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}