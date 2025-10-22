'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { FileUpload } from './file-upload'
import { ImageCropDialog } from './image-crop-dialog'
import { getCroppedImg, blobToFile, Area } from '@/lib/image-crop'
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
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }

  const handleFileSelect = async (file: File) => {
    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setSelectedFile(file)
      setOpen(false)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (
    croppedArea: Area,
    croppedAreaPixels: Area,
    rotation: number
  ) => {
    if (!imageSrc || !selectedFile) return

    setUploading(true)
    try {
      // Processar o crop da imagem
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      
      // Converter blob para file mantendo o nome original
      const croppedFile = blobToFile(croppedBlob, selectedFile.name)
      
      // Fazer upload
      await onUpload(croppedFile)
      
      // Fechar diálogo e limpar estados
      setCropDialogOpen(false)
      setImageSrc(null)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error processing image:', error)
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
    <>
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
              disabled={uploading}
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
            <DialogTitle>Selecionar foto de perfil</DialogTitle>
            <DialogDescription>
              Escolha uma imagem para seu perfil
            </DialogDescription>
          </DialogHeader>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="image/*"
            label="Selecionar foto"
          />
        </DialogContent>
      </Dialog>

      {imageSrc && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          loading={uploading}
        />
      )}
    </>
  )
}
