'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from '@/components/avatar-upload'
import { getProfile, updateProfile, uploadUserAvatar } from '@/http'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ProfileData {
  id: string
  name: string | null
  email: string
  avatarUrl: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { user } = await getProfile()
      setProfile(user)
      setName(user.name || '')
      setEmail(user.email)
    } catch (error) {
      toast.error('Não foi possível carregar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadAvatar(file: File) {
    if (!profile) return
    
    try {
      const { url } = await uploadUserAvatar({ 
        userId: profile.id, 
        file 
      })
      
      setProfile((prev) => prev ? { ...prev, avatarUrl: url } : null)
      
      toast.success('Foto de perfil atualizada com sucesso.')
    } catch (error) {
      toast.error('Não foi possível atualizar a foto de perfil.')
      throw error
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validações
    if (!name.trim()) {
      toast.error('O nome é obrigatório.')
      return
    }

    if (!email.trim()) {
      toast.error('O email é obrigatório.')
      return
    }

    // Se está tentando alterar a senha
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error('Informe a senha atual para alterar a senha.')
        return
      }

      if (newPassword !== confirmPassword) {
        toast.error('As senhas não coincidem.')
        return
      }

      if (newPassword.length < 8) {
        toast.error('A nova senha deve ter no mínimo 8 caracteres.')
        return
      }
    }

    setSaving(true)
    
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        password: newPassword || undefined,
        currentPassword: currentPassword || undefined,
      })

      toast.success('Perfil atualizado com sucesso.')

      // Limpar campos de senha
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Recarregar perfil
      await loadProfile()
    } catch (error: any) {
      const message = error?.message || 'Não foi possível atualizar o perfil.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar perfil.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Perfil</h1>
          <p className="text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>
            Adicione ou altere sua foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AvatarUpload
            currentAvatar={profile.avatarUrl}
            name={profile.name || 'Usuário'}
            onUpload={handleUploadAvatar}
            size="lg"
          />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize seu nome e email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Deixe em branco se não quiser alterar a senha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente a nova senha"
                autoComplete="new-password"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
