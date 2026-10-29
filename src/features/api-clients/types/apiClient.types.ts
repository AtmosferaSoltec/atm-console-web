export interface ApiClient {
  id: string
  name: string
  apiKeyPrefix: string
  isActive: boolean
  webhookUrl: string | null
  webhookSecret: string
  sessionsCount: number
  messagesLast24h: number
}

export type WebhookEventStatus = 'delivered' | 'pending' | 'failed'

export interface WebhookEvent {
  id: string
  type: string
  status: WebhookEventStatus
  attempts: number
  lastError: string | null
  when: string
}

export interface ApiClientCredentials {
  clientName: string
  apiKey: string
  webhookSecret: string
}

export interface ApiClientsTableProps {
  clients: ApiClient[]
  onConfigureWebhook: (client: ApiClient) => void
  onRotateKey: (client: ApiClient) => void
  onToggleActive: (client: ApiClient) => void
}

export interface CreateApiClientDialogProps {
  open: boolean
  onClose: () => void
}

export interface CredentialsDialogProps {
  credentials: ApiClientCredentials | null
  heading: string
  onClose: () => void
}

export interface WebhookDialogProps {
  client: ApiClient | null
  onClose: () => void
}
