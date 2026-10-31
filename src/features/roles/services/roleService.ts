import { request } from '@/services/httpClient'
import type { RoleItem, RoleListResponse, RoleResponse } from '../types/role.types'

function toRoleItem(role: RoleResponse): RoleItem {
  return { id: role.id, name: role.name, description: role.description, active: role.active, users: role.users, createdAt: role.created_at }
}

export async function listRoles(systemId: string, signal?: AbortSignal): Promise<RoleItem[]> {
  const { items } = await request<RoleListResponse>(`/v1/admin/systems/${systemId}/roles`, { signal })
  return items.map(toRoleItem)
}
