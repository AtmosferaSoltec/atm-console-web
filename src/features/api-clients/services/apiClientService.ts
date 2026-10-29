import type { ApiClient, ApiClientCredentials, WebhookEvent } from '../types/apiClient.types'

const CLIENTS: ApiClient[] = [
  { id: 'c1', name: 'Olympus', apiKeyPrefix: 'atm_olym_7f3a', isActive: true, webhookUrl: 'https://olympus.atmosferast.com/webhooks/messaging', webhookSecret: 'whsec_9f2b61c4d8a7e0153b6c', sessionsCount: 4, messagesLast24h: 612 },
  { id: 'c2', name: 'Lavendimia', apiKeyPrefix: 'atm_lave_2c91', isActive: true, webhookUrl: 'https://lavendimia.atmosferast.com/api/whatsapp/events', webhookSecret: 'whsec_41d7a90be2c35f8e7a10', sessionsCount: 2, messagesLast24h: 438 },
  { id: 'c3', name: 'Pulso', apiKeyPrefix: 'atm_puls_a804', isActive: true, webhookUrl: null, webhookSecret: 'whsec_c05e83b17f2d94a6e3b8', sessionsCount: 1, messagesLast24h: 156 },
  { id: 'c4', name: 'Hotel Atmosfera', apiKeyPrefix: 'atm_hote_5be2', isActive: false, webhookUrl: 'https://hotel.atmosferast.com/hooks/wa', webhookSecret: 'whsec_7a3f15c92e0b68d4a1f7', sessionsCount: 1, messagesLast24h: 0 },
]

const EVENTS: WebhookEvent[] = [
  { id: 'e1', type: 'message.delivered', status: 'delivered', attempts: 1, lastError: null, when: 'hace 2 min' },
  { id: 'e2', type: 'message.read', status: 'delivered', attempts: 1, lastError: null, when: 'hace 5 min' },
  { id: 'e3', type: 'session.disconnected', status: 'pending', attempts: 3, lastError: 'Tiempo de espera agotado', when: 'hace 12 min' },
  { id: 'e4', type: 'message.failed', status: 'failed', attempts: 5, lastError: 'HTTP 502 del destino', when: 'hace 1 h' },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getApiClients(): ApiClient[] {
  return CLIENTS
}

export function getWebhookEvents(): WebhookEvent[] {
  return EVENTS
}

export function getSampleCredentials(clientName: string): ApiClientCredentials {
  return { clientName, apiKey: 'atm_live_Kq83vXz1Lr0TnB7yHc4WmJ9sUa2DfE6p', webhookSecret: 'whsec_e19c04a7b3d5f82061ac' }
}
