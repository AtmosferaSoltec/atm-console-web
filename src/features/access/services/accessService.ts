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
    manageUsers: access.manage_users,
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

export async function assignAccess(input: AssignAccessInput): Promise<void> {
  await request<AccessResponse>('/v1/admin/access', {
    method: 'POST',
    body: {
      user_id: input.userId,
      system_id: input.systemId,
      tenant_id: input.tenantId,
      role: input.role,
      manage_users: input.manageUsers,
    },
  })
}

/** A user has at most one access per system, so the pair identifies it. */
export async function removeAccess(userId: string, systemId: string): Promise<void> {
  await request<void>(`/v1/admin/users/${userId}/access/${systemId}`, { method: 'DELETE' })
}
