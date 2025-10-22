'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from '@/components/avatar-upload'
import { getOrganization, updateOrganization, uploadOrganizationAvatar } from '@/http'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface OrganizationData {
  id: string
  name: string
  slug: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  avatarUrl: string | null
}

export default function OrganizationSettingsPage() {
  const router = useRouter()
  const params = useParams<{ org: string }>()
  const orgSlug = params.org
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState('')
  const [shouldAttachUsersByDomain, setShouldAttachUsersByDomain] = useState(false)

  useEffect(() => {
    loadOrganization()
  }, [orgSlug])

  async function loadOrganization() {
    try {
      const { organization: org } = await getOrganization(orgSlug)
      setOrganization(org)
      setName(org.name)
      setDescription('')
      setDomain(org.domain || '')
      setShouldAttachUsersByDomain(org.shouldAttachUsersByDomain)
    } catch (error) {
      toast.error('Não foi possível carregar a organização.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadAvatar(file: File) {
    if (!organization) return
    
    try {
      const { url } = await uploadOrganizationAvatar({ 
        organizationSlug: orgSlug, 
        file 
      })
      
      setOrganization((prev) => prev ? { ...prev, avatarUrl: url } : null)
      
      toast.success('Logo da organização atualizado com sucesso.')
    } catch (error) {
      toast.error('Não foi possível atualizar o logo da organização.')
      throw error
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validações
    if (!name.trim()) {
      toast.error('O nome da organização é obrigatório.')
      return
    }

    setSaving(true)
    
    try {
      await updateOrganization({
        org: orgSlug,
        name: name.trim(),
        description: description.trim() || undefined,
        domain: domain.trim() || undefined,
        shouldAttachUsersByDomain,
      })

      toast.success('Organização atualizada com sucesso.')

      // Recarregar dados
      await loadOrganization()
    } catch (error: any) {
      const message = error?.message || 'Não foi possível atualizar a organização.'
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

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar organização.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/org/${orgSlug}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configurações da Organização</h1>
          <p className="text-muted-foreground">
            Gerencie as informações da sua organização
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo da Organização</CardTitle>
          <CardDescription>
            Adicione ou altere o logo da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AvatarUpload
            currentAvatar={organization.avatarUrl}
            name={organization.name}
            onUpload={handleUploadAvatar}
            size="lg"
          />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Organização</CardTitle>
            <CardDescription>
              Atualize os dados da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da organização *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da organização"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da organização (opcional)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domínio</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="exemplo.com"
                type="text"
              />
              <p className="text-sm text-muted-foreground">
                Domínio de email para adicionar usuários automaticamente
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="auto-attach">Adicionar usuários por domínio</Label>
                <p className="text-sm text-muted-foreground">
                  Adicionar automaticamente usuários que usam o domínio especificado
                </p>
              </div>
              <Switch
                id="auto-attach"
                checked={shouldAttachUsersByDomain}
                onCheckedChange={setShouldAttachUsersByDomain}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={`/org/${orgSlug}`}>Cancelar</Link>
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
