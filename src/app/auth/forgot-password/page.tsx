'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Por favor, insira seu e-mail')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido')
      return
    }

    setIsLoading(true)

    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (error) {
      setError('Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="medical-card-elevated medical-glass">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                E-mail Enviado!
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Verifique sua caixa de entrada para continuar
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground bg-muted/20 rounded-lg p-4">
              <Mail className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p>
                Enviamos as instruções de recuperação para{' '}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Não esqueça de verificar a pasta de spam
              </p>
            </div>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/sign-in" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="medical-card-elevated medical-glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite seu e-mail e enviaremos instruções para redefinir sua senha
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar instruções
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">ou</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}