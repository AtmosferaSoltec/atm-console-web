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
    // No password is sent: the API makes the DNI the initial password and requires a change at first login.
    body: { dni: input.dni, full_name: input.fullName },
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
