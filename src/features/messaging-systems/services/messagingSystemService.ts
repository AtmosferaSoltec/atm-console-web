import { listSystems } from '@/features/systems'
import { messagingRequest } from '@/services/messagingClient'
import type {
  MessagingSystem,
  TenantSummaryResponse,
  WebhookConfig,
  WebhookEvent,
  WebhookEventResponse,
} from '../types/messagingSystem.types'

const TENANTS = '/admin/v1/tenants'
const WEBHOOK_EVENTS_LIMIT = 8

function toMessagingSystem(code: string, name: string, tenant: TenantSummaryResponse | undefined): MessagingSystem {
  return {
    code,
    name,
    tenantId: tenant?.id ?? null,
    isActive: tenant?.is_active ?? false,
    webhookUrl: tenant?.webhook_url || null,
    sessionsCount: tenant?.sessions_count ?? 0,
    messagesLast24h: tenant?.messages_last_24h ?? 0,
  }
}

/**
 * Every system of the auth API may use messaging, so the list starts from the auth API's systems and adds
 * what messaging knows. Messaging creates a system's record the first time it calls, or when it is enabled here.
 */
export async function listMessagingSystems(signal?: AbortSignal): Promise<MessagingSystem[]> {
  const [systems, { items }] = await Promise.all([
    listSystems(signal),
    messagingRequest<{ items: TenantSummaryResponse[] }>(TENANTS, { signal }),
  ])
  const tenantsByCode = new Map(items.map((tenant) => [tenant.system_code, tenant]))
  const known = systems.map((system) => toMessagingSystem(system.code, system.name, tenantsByCode.get(system.code)))
  // A record whose system was deleted from the auth API is still shown, so its data does not go unseen.
  const orphans = items
    .filter((tenant) => !systems.some((system) => system.code === tenant.system_code))
    .map((tenant) => toMessagingSystem(tenant.system_code, tenant.name, tenant))
  return [...known, ...orphans]
}

/** Creates the system's record in messaging (idempotent) and returns its id. */
export async function enableSystem(systemCode: string): Promise<string> {
  const { id } = await messagingRequest<{ id: string }>(TENANTS, { method: 'POST', body: { system_code: systemCode } })
  return id
}

/** A deactivated system's token stops being accepted by messaging; its connections are kept. */
export async function setSystemActive(tenantId: string, isActive: boolean): Promise<void> {
  await messagingRequest<unknown>(`${TENANTS}/${tenantId}`, { method: 'PATCH', body: { is_active: isActive } })
}

export function getWebhookConfig(tenantId: string, signal?: AbortSignal): Promise<WebhookConfig> {
  return messagingRequest<WebhookConfig>(`${TENANTS}/${tenantId}/webhook`, { signal })
}

/** An empty URL turns the system's webhooks off. */
export async function saveWebhookUrl(tenantId: string, url: string): Promise<void> {
  if (url === '') {
    await messagingRequest<void>(`${TENANTS}/${tenantId}/webhook`, { method: 'DELETE' })
    return
  }
  await messagingRequest<void>(`${TENANTS}/${tenantId}/webhook`, { method: 'PUT', body: { url } })
}

export async function sendWebhookTest(tenantId: string): Promise<void> {
  await messagingRequest<void>(`${TENANTS}/${tenantId}/webhook/test`, { method: 'POST' })
}

export async function listWebhookEvents(tenantId: string, signal?: AbortSignal): Promise<WebhookEvent[]> {
  const { items } = await messagingRequest<{ items: WebhookEventResponse[] }>(
    `${TENANTS}/${tenantId}/webhook/events?limit=${WEBHOOK_EVENTS_LIMIT}`,
    { signal },
  )
  return items.map((event) => ({
    id: event.id,
    type: event.type,
    status: event.status,
    attempts: event.attempts,
    lastError: event.last_error ?? null,
    createdAt: event.created_at,
  }))
}
