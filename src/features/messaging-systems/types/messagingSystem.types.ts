export type WebhookEventStatus = 'delivered' | 'pending' | 'failed'

/** A system registered in the auth API, with what messaging knows about it. */
export interface MessagingSystem {
  code: string
  name: string
  /** Null until the system calls messaging for the first time (or someone enables it here). */
  tenantId: string | null
  isActive: boolean
  webhookUrl: string | null
  sessionsCount: number
  messagesLast24h: number
}

export interface WebhookConfig {
  url: string
  secret: string
}

export interface WebhookEvent {
  id: string
  type: string
  status: WebhookEventStatus
  attempts: number
  lastError: string | null
  createdAt: string
}

export interface TenantSummaryResponse {
  id: string
  name: string
  system_code: string
  is_active: boolean
  webhook_url: string
  created_at: string
  sessions_count: number
  messages_last_24h: number
}

export interface WebhookEventResponse {
  id: string
  type: string
  status: WebhookEventStatus
  attempts: number
  last_error?: string
  created_at: string
}

export interface MessagingSystemsTableProps {
  systems: MessagingSystem[]
  isLoading: boolean
  error: string | null
  onEnable: (system: MessagingSystem) => void
  onConfigureWebhook: (system: MessagingSystem) => void
  onToggleActive: (system: MessagingSystem) => void
}

export interface WebhookDialogProps {
  system: MessagingSystem | null
  onClose: () => void
  onSaved: () => void
}
