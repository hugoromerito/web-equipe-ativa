'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { FileUpload } from './file-upload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface AvatarUploadProps {
  currentAvatar?: string | null
  name?: string
  onUpload: (file: File) => Promise<void>
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarUpload({
  currentAvatar,
  name = 'User',
  onUpload,
  size = 'lg',
}: AvatarUploadProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      await onUpload(file)
      setOpen(false)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative inline-block">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatar || undefined} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
          <DialogDescription>
            Selecione uma nova foto para o perfil
          </DialogDescription>
        </DialogHeader>
        <FileUpload
          onUpload={handleUpload}
          accept="image/*"
          loading={uploading}
          label="Foto de perfil"
          description="PNG, JPG ou GIF (máx. 5MB)"
        />
      </DialogContent>
    </Dialog>
  )
}
