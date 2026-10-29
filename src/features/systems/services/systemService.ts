import { request } from '@/services/httpClient'
import type { CreateSystemInput, IssuedSecret, SessionPolicy, SystemItem, SystemListResponse, SystemResponse } from '../types/system.types'

function toSystemItem(system: SystemResponse): SystemItem {
  return {
    id: system.id,
    code: system.code,
    name: system.name,
    sessionMode: system.session_mode,
    sessionMinutes: system.session_minutes,
    hasSecret: system.has_secret,
    secretCreatedAt: system.secret_created_at ?? null,
    secretLastUsedAt: system.secret_last_used_at ?? null,
    createdAt: system.created_at,
  }
}

export async function listSystems(signal?: AbortSignal): Promise<SystemItem[]> {
  const { items } = await request<SystemListResponse>('/v1/admin/systems', { signal })
  return items.map(toSystemItem)
}

export async function createSystem(input: CreateSystemInput): Promise<SystemItem> {
  const system = await request<SystemResponse>('/v1/admin/systems', {
    method: 'POST',
    body: { code: input.code, name: input.name, session_mode: input.session.mode, session_minutes: input.session.minutes },
  })
  return toSystemItem(system)
}

/** Deletes the system and everything that depends on it. The API requires the system's code as confirmation. */
export async function deleteSystem(systemId: string, confirmCode: string): Promise<void> {
  await request<void>(`/v1/admin/systems/${systemId}?confirm=${encodeURIComponent(confirmCode)}`, { method: 'DELETE' })
}

/** Sessions already open pick the new policy the next time they are refreshed. */
export async function updateSystemSession(systemId: string, policy: SessionPolicy): Promise<SystemItem> {
  const system = await request<SystemResponse>(`/v1/admin/systems/${systemId}/session`, {
    method: 'PUT',
    body: { mode: policy.mode, minutes: policy.minutes },
  })
  return toSystemItem(system)
}

/** Creates (or replaces) the system's credential. The old one stops working at once. */
export async function generateSystemSecret(systemId: string): Promise<IssuedSecret> {
  const issued = await request<{ client_id: string; client_secret: string }>(`/v1/admin/systems/${systemId}/secret`, { method: 'POST' })
  return { clientId: issued.client_id, clientSecret: issued.client_secret }
}

/** Tokens already issued last until they expire. */
export async function revokeSystemSecret(systemId: string): Promise<void> {
  await request<void>(`/v1/admin/systems/${systemId}/secret`, { method: 'DELETE' })
}
