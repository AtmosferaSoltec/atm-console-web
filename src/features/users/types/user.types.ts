import type { AccessItem } from '@/features/access'
import type { SystemItem } from '@/features/systems'
import type { EntityStatus } from '@/types/common.types'

export interface UserItem {
  id: string
  dni: string
  fullName: string
  status: EntityStatus
  /** True while the account still has its initial password (the DNI). */
  mustChangePassword: boolean
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface UserResponse {
  id: string
  dni: string
  full_name: string
  status: EntityStatus
  must_change_password: boolean
  created_at: string
}

export interface UserListResponse {
  items: UserResponse[]
}

export interface CreateUserInput {
  dni: string
  fullName: string
}

export interface UsersListProps {
  users: UserItem[]
  isLoading: boolean
  error: string | null
  /** Accesses of all systems; they tell which users belong to which system and company. */
  access: AccessItem[]
  systems: SystemItem[]
  isAccessLoading: boolean
  accessError: string | null
}

export interface UserSummaryProps {
  user: UserItem
}

export interface UserActionsProps {
  user: UserItem
  /** Called after the account changed, so the list can reload. */
  onChanged: () => void
}

export interface CreateUserDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}
