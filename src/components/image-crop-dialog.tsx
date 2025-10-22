'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from '@/lib/image-crop'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Slider } from './ui/slider'
import { Loader2, ZoomIn, RotateCw } from 'lucide-react'

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area, rotation: number) => void
  loading?: boolean
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  loading = false,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedArea)
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleConfirm = () => {
    if (croppedArea && croppedAreaPixels) {
      onCropComplete(croppedArea, croppedAreaPixels, rotation)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajustar foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área de crop */}
          <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              cropShape="round"
              showGrid={false}
            />
          </div>

          {/* Controles de zoom */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium min-w-12">Zoom</span>
              <Slider
                value={[zoom]}
                onValueChange={(value: number[]) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Controles de rotação */}
            <div className="flex items-center gap-3">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium min-w-12">Rotação</span>
              <Slider
                value={[rotation]}
                onValueChange={(value: number[]) => setRotation(value[0])}
                min={0}
                max={360}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-12 text-right">
                {rotation}°
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !croppedAreaPixels}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Confirmar e enviar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
