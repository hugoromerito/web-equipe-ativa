'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { AlertTriangle, Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'

import googleIcon from '@/assets/google-icon.svg'
import eaLogo from '@/assets/eabeta-logo.svg'
import Image from 'next/image'
import { signInWithEmailAndPassword } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '../actions'

export default function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header com logo e título */}
      <div className="text-center mb-8">
        <div className="relative mb-6">
          <Image 
            src={eaLogo} 
            className="mx-auto size-20 md:size-24 drop-shadow-sm" 
            alt="EA Beta Logo" 
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Entre na sua conta para continuar
        </p>
      </div>

      <div className="space-y-6">
        {/* Botão Google em destaque */}
        <form action={signInWithGoogle}>
          <Button 
            type="submit" 
            className="w-full h-11 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors"
            variant="outline"
          >
            <Image src={googleIcon} className="mr-3 size-5" alt="" />
            Continuar com Google
          </Button>
        </form>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              ou entre com e-mail
            </span>
          </div>
        </div>

        {/* Formulário de e-mail */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao fazer login</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Campo de e-mail com ícone */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                name="email" 
                type="email" 
                id="email"
                className="pl-10 h-11 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
            {errors?.email && (
              <p className="text-sm font-medium text-red-500 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
                {errors.email[0]}
              </p>
            )}
          </div>

          {/* Campo de senha com ícone e toggle de visibilidade */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                id="password"
                className="pl-10 pr-10 h-11 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-gray-400" />
                ) : (
                  <Eye className="size-4 text-gray-400" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                </span>
              </Button>
            </div>
            {errors?.password && (
              <p className="text-sm font-medium text-red-500 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
                {errors.password[0]}
              </p>
            )}
          </div>

          {/* Link esqueceu senha */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Botão de submit */}
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Link para criar conta */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link 
              href="/auth/sign-up"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}