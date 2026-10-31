export interface RoleItem {
  id: string
  name: string
  description: string
  /** False when the catalog retired the role: it keeps its accesses but cannot be assigned. */
  active: boolean
  /** How many people have this role today. */
  users: number
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface RoleResponse {
  id: string
  name: string
  description: string
  active: boolean
  users: number
  created_at: string
}

export interface RoleListResponse {
  items: RoleResponse[]
}

export interface RolesTabProps {
  systemName: string
  roles: RoleItem[]
  isLoading: boolean
  error: string | null
}
