import Image from 'next/image'
import eaLogo from '@/assets/eabeta-logo.svg'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { UnitSwitcher } from './unit-switcher'
import { ability } from '@/lib/auth'
// import { ButtonCreateApplicant } from './button-create-applicant'
import { ThemeSwitcher } from './theme/theme-switcher'
import Link from 'next/link'
import { PendingInvites } from './pending-invites'
import { ProfileMobile } from './profile-mobile'
import { ProfileDesktop } from './profile-desktop'
import { Tabs } from './tabs'
// import { MobileMenu } from './mobile-menu'

export async function Header() {
  const permissions = await ability()
  return (
    <header className="medical-header sticky top-0 z-50 mb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4">
          {/* Header principal */}
          <div className="flex w-full items-center justify-between">
            {/* Logo e navegação principal */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="p-2 rounded-lg">
                  <Image
                    src={eaLogo}
                    alt="Equipe Ativa"
                    className="w-25 md:w-30"
                  />
                </div>
                {/* <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-primary">Equipe Ativa</h1>
                  <p className="text-xs text-muted-foreground">Sistema Médico</p>
                </div> */}
              </Link>

              {/* Separador visual */}
              {/* <div className="hidden md:block h-8 w-px bg-border"></div> */}

              {/* Seletores de organização e setor */}
              {/* <div className="hidden md:flex items-center space-x-4">
                <OrganizationSwitcher />
                <div className="h-4 w-px bg-border"></div>
                <UnitSwitcher />
              </div> */}
            </div>

            {/* Ações do usuário */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
              <PendingInvites />
              </div>
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              <div className="h-4 w-px bg-border hidden md:block"></div>
              <div className="hidden md:block">
                <ProfileDesktop />
              </div>
              <div className="md:hidden">
                <ProfileMobile />
              </div>
            </div>
          </div>

          {/* Seletores mobile */}
          {/* <div className="flex md:hidden items-center space-x-4 pt-2 border-t border-border/50">
            <OrganizationSwitcher />
            <div className="h-4 w-px bg-border"></div>
            <UnitSwitcher />
          </div> */}

          {/* Navegação por abas */}
          <div className="hidden md:block pt-2 border-t border-border/50">
            <Tabs />
          </div>
        </div>
      </div>
    </header>
  )
}