import type { EntityStatus } from '@/types/common.types'

/** A system enabled for a tenant. */
export interface TenantSystem {
  id: string
  code: string
  name: string
}

export interface TenantItem {
  id: string
  ruc: string
  legalName: string
  tradeName: string
  /** Trade name, or the legal name when there is none. */
  displayName: string
  status: EntityStatus
  systems: TenantSystem[]
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface TenantResponse {
  id: string
  ruc: string
  legal_name: string
  trade_name: string
  display_name: string
  status: EntityStatus
  systems: TenantSystem[]
  created_at: string
}

export interface TenantListResponse {
  items: TenantResponse[]
}

export interface CreateTenantInput {
  ruc: string
  legalName: string
  tradeName: string
}

export interface TenantsTableProps {
  tenants: TenantItem[]
  emptyMessage: string
  onManageSystems: (tenant: TenantItem) => void
}

export interface SystemTenantsTableProps {
  tenants: TenantItem[]
  isLoading: boolean
  error: string | null
}

export interface TenantsListProps {
  tenants: TenantItem[]
  isLoading: boolean
  error: string | null
  /** Called after the systems of a tenant changed, so the list can reload. */
  onChanged: () => void
}

export interface TenantSystemChange {
  systemId: string
  name: string
  /** True to enable the system for the tenant, false to disable it. */
  enable: boolean
}

export interface CreateTenantDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export interface TenantSystemsDialogProps {
  tenant: TenantItem | null
  onClose: () => void
  onSaved: () => void
}

export interface TenantSystemsFormProps {
  tenant: TenantItem
  onClose: () => void
  onSaved: () => void
}
