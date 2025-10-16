export const ATTACHMENT_TYPES = {
  AVATAR: 'Avatar',
  DOCUMENT: 'Documento',
  IMAGE: 'Imagem',
  VIDEO: 'Vídeo',
  AUDIO: 'Áudio',
  PDF: 'PDF',
  SPREADSHEET: 'Planilha',
  OTHER: 'Outro',
} as const

export type AttachmentType = keyof typeof ATTACHMENT_TYPES

export function translateAttachmentType(type: AttachmentType): string {
  return ATTACHMENT_TYPES[type] || type
}
