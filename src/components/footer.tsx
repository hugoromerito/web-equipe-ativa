import { Separator } from './ui/separator'

export function Footer() {
  return (
    <footer className="mt-auto border-t">
       <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground md:px-6">
        © {new Date().getFullYear()} Equipe Ativa. Todos os direitos reservados.
      </div>
    </footer>
  )
}
