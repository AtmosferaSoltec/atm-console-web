import type { LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/types/ui.types'

export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
export type MessagePriority = 'transactional' | 'promotional'
export type MessageKind = 'text' | 'image' | 'video' | 'audio' | 'document'

export interface Message {
  id: string
  tenantId: string
  sessionId: string
  recipient: string
  kind: MessageKind
  priority: MessagePriority
  status: MessageStatus
  error: string | null
  attempts: number
  /** ISO date. */
  createdAt: string
}

/** A message with the names the operator recognizes it by. */
export interface MessageRow extends Message {
  accountRef: string
  clientName: string
}

export interface MessageResponse {
  id: string
  tenant_id: string
  session_id: string
  to: string
  type: MessageKind
  priority: MessagePriority
  status: MessageStatus
  attempts: number
  error?: string
  created_at: string
}

export interface MessageFiltersValue {
  /** Id of the system's record in messaging, or 'all'. */
  tenantId: string
  status: string
  priority: string
  search: string
}

export interface MessagesPage {
  items: Message[]
  hasMore: boolean
}

export interface MessagesResult {
  rows: MessageRow[]
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

export interface Attachment {
  filename: string
  mimeType: string
  contentBase64: string
}

export interface SendMessageInput {
  sessionId: string
  to: string
  kind: MessageKind
  body: string
  priority: MessagePriority
  attachment?: Attachment
}

export interface KindOption {
  value: MessageKind
  label: string
  icon: LucideIcon
  hint: string
  /** Value of the file input's accept attribute. Empty for text. */
  accept: string
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
  isLoading?: boolean
  error?: string | null
  compact?: boolean
}

export interface SendMessageDialogProps {
  open: boolean
  onClose: () => void
  /** Connection to preselect, when the dialog is opened from a row. */
  initialSessionId?: string
}

export interface MessageProgressProps {
  messageId: string
}
