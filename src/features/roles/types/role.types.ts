export interface RoleItem {
  id: string
  name: string
  description: string
  /** How many people have this role today. */
  users: number
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface RoleResponse {
  id: string
  name: string
  description: string
  users: number
  created_at: string
}

export interface RoleListResponse {
  items: RoleResponse[]
}

export interface CreateRoleInput {
  name: string
  description: string
}

export interface RolesTabProps {
  systemId: string
  systemName: string
  roles: RoleItem[]
  isLoading: boolean
  error: string | null
  /** Called after a role was created or deleted, so the list can reload. */
  onChanged: () => void
}

export interface CreateRoleDialogProps {
  systemId: string
  open: boolean
  onClose: () => void
  onCreated: () => void
}
