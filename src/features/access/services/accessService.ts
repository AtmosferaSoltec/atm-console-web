import { request } from '@/services/httpClient'
import type { AccessItem, AccessListResponse, AccessResponse, AssignAccessInput } from '../types/access.types'

function toAccessItem(access: AccessResponse): AccessItem {
  return {
    id: access.id,
    userId: access.user_id,
    userName: access.user_name ?? '',
    userDni: access.user_dni ?? '',
    systemId: access.system_id,
    systemName: access.system_name ?? access.system_code ?? '',
    tenantId: access.tenant_id,
    tenantName: access.tenant_name ?? '',
    role: access.role,
    createdAt: access.created_at,
  }
}

export async function listAccessByUser(userId: string, signal?: AbortSignal): Promise<AccessItem[]> {
  const { items } = await request<AccessListResponse>(`/v1/admin/users/${userId}/access`, { signal })
  return items.map(toAccessItem)
}

export async function listAccessBySystem(systemId: string, signal?: AbortSignal): Promise<AccessItem[]> {
  const { items } = await request<AccessListResponse>(`/v1/admin/systems/${systemId}/access`, { signal })
  return items.map(toAccessItem)
}

/** Every access of the given systems; a user has at most one per system, so this is the whole picture. */
export async function listAccessBySystems(systemIds: string[], signal?: AbortSignal): Promise<AccessItem[]> {
  const lists = await Promise.all(systemIds.map((systemId) => listAccessBySystem(systemId, signal)))
  return lists.flat()
}

export async function assignAccess(input: AssignAccessInput): Promise<void> {
  await request<AccessResponse>('/v1/admin/access', {
    method: 'POST',
    body: {
      user_id: input.userId,
      system_id: input.systemId,
      tenant_id: input.tenantId,
      role: input.role,
    },
  })
}

/** A user can work for several companies in one system, so an access is removed by its own id. */
export async function removeAccess(accessId: string): Promise<void> {
  await request<void>(`/v1/admin/access/${accessId}`, { method: 'DELETE' })
}
