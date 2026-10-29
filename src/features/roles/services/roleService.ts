import { request } from '@/services/httpClient'
import type { CreateRoleInput, RoleItem, RoleListResponse, RoleResponse } from '../types/role.types'

function toRoleItem(role: RoleResponse): RoleItem {
  return { id: role.id, name: role.name, description: role.description, users: role.users, createdAt: role.created_at }
}

export async function listRoles(systemId: string, signal?: AbortSignal): Promise<RoleItem[]> {
  const { items } = await request<RoleListResponse>(`/v1/admin/systems/${systemId}/roles`, { signal })
  return items.map(toRoleItem)
}

export async function createRole(systemId: string, input: CreateRoleInput): Promise<RoleItem> {
  const role = await request<RoleResponse>(`/v1/admin/systems/${systemId}/roles`, { method: 'POST', body: input })
  return toRoleItem(role)
}

/** Fails while someone still has the role. */
export async function deleteRole(systemId: string, roleId: string): Promise<void> {
  await request<void>(`/v1/admin/systems/${systemId}/roles/${roleId}`, { method: 'DELETE' })
}
