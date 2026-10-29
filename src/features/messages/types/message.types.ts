import type { LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/types/ui.types'

export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
export type MessagePriority = 'transactional' | 'promotional'
export type MessageKind = 'text' | 'image' | 'video' | 'audio' | 'document'

export interface MessageRow {
  id: string
  when: string
  accountRef: string
  clientName: string
  recipient: string
  kind: MessageKind
  priority: MessagePriority
  status: MessageStatus
  error: string | null
  attempts: number
}

export interface MessageFiltersValue {
  clientName: string
  status: string
  priority: string
  search: string
}

export interface MessagesPageResult {
  rows: MessageRow[]
  total: number
  hasMore: boolean
}

export interface KindOption {
  value: MessageKind
  label: string
  icon: LucideIcon
  hint: string
}

export interface StatusBadgeConfig {
  label: string
  tone: BadgeTone
}

export interface MessageFiltersProps {
  value: MessageFiltersValue
  onChange: (next: MessageFiltersValue) => void
}

export interface MessagesTableProps {
  messages: MessageRow[]
  compact?: boolean
}

export interface SendMessageDialogProps {
  open: boolean
  onClose: () => void
  /** Connection to preselect, when the dialog is opened from a row. */
  initialSessionId?: string
}
