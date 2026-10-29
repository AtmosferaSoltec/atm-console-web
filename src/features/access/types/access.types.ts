export interface AccessItem {
  id: string
  userId: string
  userName: string
  userDni: string
  systemId: string
  systemName: string
  tenantId: string
  tenantName: string
  /** Free text: each system defines what its roles mean. */
  role: string
  /** The user is the owner of the tenant in this system and can manage its members. */
  manageUsers: boolean
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface AccessResponse {
  id: string
  user_id: string
  system_id: string
  system_code?: string
  system_name?: string
  user_dni?: string
  user_name?: string
  tenant_id: string
  tenant_name?: string
  role: string
  manage_users: boolean
  created_at: string
}

export interface AccessListResponse {
  items: AccessResponse[]
}

export interface AssignAccessInput {
  userId: string
  systemId: string
  tenantId: string
  role: string
  manageUsers: boolean
}

export type AccessTableVariant = 'byUser' | 'bySystem'

export interface AccessTableProps {
  items: AccessItem[]
  variant: AccessTableVariant
  isLoading: boolean
  error: string | null
  /** Called after an access was removed, so the list can reload. */
  onChanged: () => void
}

export interface RolesInUseTableProps {
  items: AccessItem[]
  isLoading: boolean
  error: string | null
}

export interface AssignAccessDialogProps {
  open: boolean
  onClose: () => void
  onAssigned: () => void
  /** Fixes the user, so the dialog does not ask for one. */
  userId?: string
  /** Fixes the system, so the dialog does not ask for one. */
  systemId?: string
  /** Roles already in use, offered as suggestions while typing. */
  roleSuggestions?: string[]
}
