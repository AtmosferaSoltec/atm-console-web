import { messagingRequest } from '@/services/messagingClient'
import type { ConnectLink, ConnectLinkResponse, SessionResponse } from '../types/session.types'

const SESSIONS = '/admin/v1/sessions'
const MAX_SESSIONS = 500

/** What the API returns before the system's name is added (see `useSessions`). */
export interface RawSession {
  id: string
  tenantId: string
  accountRef: string
  status: SessionResponse['status']
  phone: string | null
  connectedAt: string | null
}

export async function listSessions(signal?: AbortSignal): Promise<RawSession[]> {
  const { items } = await messagingRequest<{ items: SessionResponse[] }>(`${SESSIONS}?limit=${MAX_SESSIONS}`, { signal })
  return items.map((session) => ({
    id: session.id,
    tenantId: session.tenant_id,
    accountRef: session.account_ref,
    status: session.status,
    phone: session.phone || null,
    connectedAt: session.connected_at,
  }))
}

/** Creates the connection of a company. Each company has one per channel. */
export async function createSession(tenantId: string, accountRef: string): Promise<string> {
  const { id } = await messagingRequest<{ id: string }>(SESSIONS, {
    method: 'POST',
    body: { tenant_id: tenantId, account_ref: accountRef, channel: 'whatsapp' },
  })
  return id
}

/** A new link replaces the previous one, which stops working. */
export async function createConnectLink(sessionId: string, label: string): Promise<ConnectLink> {
  const link = await messagingRequest<ConnectLinkResponse>(`${SESSIONS}/${sessionId}/connect-link`, { method: 'POST', body: { label } })
  return { url: link.url, label: link.label, expiresAt: link.expires_at }
}

/** Unlinks the number but keeps the connection, ready to be paired again. */
export async function disconnectSession(sessionId: string): Promise<void> {
  await messagingRequest<void>(`${SESSIONS}/${sessionId}/disconnect`, { method: 'POST' })
}

export async function deleteSession(sessionId: string): Promise<void> {
  await messagingRequest<void>(`${SESSIONS}/${sessionId}`, { method: 'DELETE' })
}
