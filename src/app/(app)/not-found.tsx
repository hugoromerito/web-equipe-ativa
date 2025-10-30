import Link from 'next/link'
import { Home, ArrowLeft, FileQuestion, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundApp() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Ícone principal */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-full p-8 animate-in zoom-in duration-500">
            <FileQuestion className="w-32 h-32 text-primary animate-in spin-in duration-1000 delay-200" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Recurso Não Encontrado
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            A página ou recurso que você está tentando acessar não existe ou não está disponível.
          </p>
        </div>

        {/* Cards informativos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
            <Building2 className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-card-foreground mb-2">
              Organização Inválida
            </h3>
            <p className="text-sm text-muted-foreground">
              A organização ou unidade não foi encontrada
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
            <FileQuestion className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-card-foreground mb-2">
              Sem Permissão
            </h3>
            <p className="text-sm text-muted-foreground">
              Você pode não ter acesso a este recurso
            </p>
          </div>
        </div>

        {/* Sugestões */}
        <div className="bg-muted/50 rounded-lg p-6 max-w-xl mx-auto animate-in fade-in duration-700 delay-700">
          <h3 className="font-semibold text-foreground mb-3">O que você pode fazer?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Verificar se o endereço (URL) está correto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Confirmar se você tem permissão para acessar este recurso</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Entrar em contato com o administrador da organização</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Voltar à página inicial e tentar novamente</span>
            </li>
          </ul>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-700 delay-1000">
          <Button
            asChild
            size="lg"
            className="shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Ir para o Início
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Info adicional */}
        <p className="text-xs text-muted-foreground/70 animate-in fade-in duration-700 delay-1000">
          Se o problema persistir, entre em contato com o suporte técnico
        </p>
      </div>
    </div>
  )
}
