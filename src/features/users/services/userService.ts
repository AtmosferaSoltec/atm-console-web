import { request } from '@/services/httpClient'
import type { CreateUserInput, UserItem, UserListResponse, UserResponse } from '../types/user.types'

function toUserItem(user: UserResponse): UserItem {
  return {
    id: user.id,
    dni: user.dni,
    fullName: user.full_name,
    status: user.status,
    mustChangePassword: user.must_change_password,
    createdAt: user.created_at,
  }
}

export async function listUsers(signal?: AbortSignal): Promise<UserItem[]> {
  const { items } = await request<UserListResponse>('/v1/admin/users', { signal })
  return items.map(toUserItem)
}

export async function createUser(input: CreateUserInput): Promise<UserItem> {
  const user = await request<UserResponse>('/v1/admin/users', {
    method: 'POST',
    // An omitted password makes the API use the DNI as the initial password.
    body: { dni: input.dni, full_name: input.fullName, ...(input.password && { password: input.password }) },
  })
  return toUserItem(user)
}

/** The password goes back to the DNI, a change is required at next login and all sessions end. */
export async function resetUserPassword(userId: string): Promise<void> {
  await request<void>(`/v1/admin/users/${userId}/reset-password`, { method: 'POST' })
}

/** Disabling an account also ends all its sessions. */
export async function setUserStatus(userId: string, status: 'active' | 'disabled'): Promise<void> {
  await request<void>(`/v1/admin/users/${userId}/status`, { method: 'PUT', body: { status } })
}
