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
  /** Company profile, all optional ('' when not set). Systems read it from the auth API. */
  address: string
  department: string
  province: string
  district: string
  /** 6-digit INEI code of the district. */
  ubigeo: string
  phone: string
  email: string
  /** Id of the logo in the storage API, or '' when there is none. */
  logoFileId: string
  /** The client the company belongs to. Companies of one client can share data inside a system. */
  clientId: string
  clientName: string
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
  address: string
  department: string
  province: string
  district: string
  ubigeo: string
  phone: string
  email: string
  logo_file_id: string | null
  client_id: string
  client_name: string
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
  /** The client that owns the company. Without it the company gets a new client named after it. */
  clientId?: string
}

export interface UpdateTenantInput {
  legalName: string
  tradeName: string
  address: string
  department: string
  province: string
  district: string
  ubigeo: string
  phone: string
  email: string
  logoFileId: string
}

export interface TenantsTableProps {
  tenants: TenantItem[]
  emptyMessage: string
  onEdit: (tenant: TenantItem) => void
  onManageSystems: (tenant: TenantItem) => void
  onChangeClient: (tenant: TenantItem) => void
}

export interface EditTenantDialogProps {
  tenant: TenantItem | null
  onClose: () => void
  onSaved: () => void
}

export interface EditTenantFormProps {
  tenant: TenantItem
  onClose: () => void
  onSaved: () => void
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

export interface TenantClientDialogProps {
  tenant: TenantItem | null
  onClose: () => void
  onSaved: () => void
}

export interface TenantClientFormProps {
  tenant: TenantItem
  onClose: () => void
  onSaved: () => void
}
