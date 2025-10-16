'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // em MB
  label?: string
  preview?: boolean
  className?: string
}

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5,
  label = 'Selecionar arquivo',
  preview = true,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      alert(`O arquivo deve ter no máximo ${maxSize}MB`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)

    // Gerar preview se for imagem
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </Button>

        {selectedFile && (
          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
