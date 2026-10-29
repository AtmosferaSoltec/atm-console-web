import type { BadgeTone } from '@/types/ui.types'

export type TemplateFormat = 'pdf' | 'email'

export interface DocumentTemplate {
  id: string
  name: string
  systemName: string
  format: TemplateFormat
  version: number
  isActive: boolean
  updatedAt: string
}

export type GenerationStatus = 'ready' | 'processing' | 'failed'

export interface GeneratedDocument {
  id: string
  templateName: string
  systemName: string
  status: GenerationStatus
  size: string | null
  createdAt: string
}

export interface StatusConfig {
  label: string
  tone: BadgeTone
}

export interface TemplatesTableProps {
  templates: DocumentTemplate[]
}

export interface GeneratedTableProps {
  documents: GeneratedDocument[]
}

export interface CreateTemplateDialogProps {
  open: boolean
  onClose: () => void
}
