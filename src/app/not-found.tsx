import Link from 'next/link'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animação 404 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
              404
            </h1>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-ping opacity-20" />
            </div>
          </div>
        </div>

        {/* Mensagem */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Página Não Encontrada
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Cards de ajuda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <Search className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              URL Errada?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verifique se o endereço está correto
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <HelpCircle className="w-8 h-8 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Precisa de Ajuda?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Entre em contato com o suporte
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <Home className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Voltar ao Início
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Acesse a página principal
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ir para o Início
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 hover:bg-slate-100 dark:hover:bg-slate-800 group"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Decoração de fundo */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Código de erro decorativo */}
        <div className="text-xs text-slate-400 dark:text-slate-600 font-mono animate-in fade-in duration-1000 delay-700">
          ERROR_CODE: HTTP_404_NOT_FOUND
        </div>
      </div>
    </div>
  )
}
