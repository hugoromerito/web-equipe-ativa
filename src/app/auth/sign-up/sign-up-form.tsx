'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { AlertTriangle, Loader2, Eye, EyeOff, Mail, Lock, User, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import googleIcon from '@/assets/google-icon.svg'
import eaLogo from '@/assets/ea-logo.svg'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '../actions'
import { signUpAction } from './actions'

export default function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in')
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
        <h1 className="text-2xl font-bold text-foreground">
          Criar sua conta
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Junte-se a nós e comece sua jornada
        </p>
      </div>

      <div className="space-y-6">
        {/* Botão Google em destaque */}
        <form action={signInWithGoogle}>
          <Button 
            type="submit" 
            className="w-full h-11 medical-button medical-button-outline"
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
            <span className="bg-background px-2 text-muted-foreground">
              ou cadastre-se com e-mail
            </span>
          </div>
        </div>

        {/* Formulário de cadastro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro no cadastro</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Campo de nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                name="name" 
                type="text" 
                id="name"
                className="pl-10 h-11 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome completo"
              />
            </div>
            {errors?.name && (
              <p className="text-sm font-medium text-red-500 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* Campo de e-mail */}
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

          {/* Campo de senha */}
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
                placeholder="Crie uma senha forte"
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
            {/* Dicas de senha */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres com letras e números
            </p>
          </div>

          {/* Campo de confirmação de senha */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-sm font-medium">
              Confirmar senha
            </Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                name="password_confirmation" 
                type={showConfirmPassword ? "text" : "password"} 
                id="password_confirmation"
                className="pl-10 pr-10 h-11 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite a senha novamente"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4 text-gray-400" />
                ) : (
                  <Eye className="size-4 text-gray-400" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                </span>
              </Button>
            </div>
            {errors?.password_confirmation && (
              <p className="text-sm font-medium text-red-500 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
                {errors.password_confirmation[0]}
              </p>
            )}
          </div>

          {/* Botão de submit */}
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Criando conta...
                </>
              ) : (
                'Criar minha conta'
              )}
            </Button>
          </div>

          {/* Termos de uso */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </form>

        {/* Link para login */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link 
              href="/auth/sign-in"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}