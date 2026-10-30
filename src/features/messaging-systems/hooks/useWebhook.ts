import { useCallback } from 'react'
import { useAction } from '@/hooks/useAction'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getWebhookConfig, listWebhookEvents, saveWebhookUrl, sendWebhookTest } from '../services/messagingSystemService'

export function useWebhookConfig(tenantId: string) {
  const fetcher = useCallback((signal: AbortSignal) => getWebhookConfig(tenantId, signal), [tenantId])
  return useApiQuery(fetcher)
}

export function useWebhookEvents(tenantId: string) {
  const fetcher = useCallback((signal: AbortSignal) => listWebhookEvents(tenantId, signal), [tenantId])
  return useApiQuery(fetcher)
}

const SAVE_ERRORS: Record<string, string> = {
  invalid_url: 'La URL no es válida. Debe ser https y de un servidor público.',
}

export function useSaveWebhook(tenantId: string) {
  return useAction((url: string) => saveWebhookUrl(tenantId, url), 'No se pudo guardar el webhook. Intenta de nuevo.', SAVE_ERRORS)
}

export function useSendWebhookTest(tenantId: string) {
  return useAction(() => sendWebhookTest(tenantId), 'No se pudo enviar la prueba. Revisa que el webhook esté guardado.')
}
