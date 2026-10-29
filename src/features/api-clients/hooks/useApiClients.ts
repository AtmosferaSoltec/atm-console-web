import { getApiClients, getSampleCredentials, getWebhookEvents } from '../services/apiClientService'
import type { ApiClient, ApiClientCredentials, WebhookEvent } from '../types/apiClient.types'

export function useApiClients(): ApiClient[] {
  return getApiClients()
}

export function useWebhookEvents(): WebhookEvent[] {
  return getWebhookEvents()
}

export function useSampleCredentials(clientName: string): ApiClientCredentials {
  return getSampleCredentials(clientName)
}
