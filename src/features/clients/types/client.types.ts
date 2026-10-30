/** A company that belongs to a client. */
export interface ClientTenant {
  id: string
  ruc: string
  displayName: string
}

/** The real customer: the person or business that has one or more companies. */
export interface ClientItem {
  id: string
  name: string
  tenants: ClientTenant[]
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface ClientTenantResponse {
  id: string
  ruc: string
  display_name: string
}

export interface ClientResponse {
  id: string
  name: string
  tenants: ClientTenantResponse[]
  created_at: string
}

export interface ClientListResponse {
  items: ClientResponse[]
}

export interface ClientsListProps {
  clients: ClientItem[]
  isLoading: boolean
  error: string | null
  /** Called after a client was renamed or deleted, so the list can reload. */
  onChanged: () => void
}

export interface ClientsTableProps {
  clients: ClientItem[]
  emptyMessage: string
  onRename: (client: ClientItem) => void
  onDelete: (client: ClientItem) => void
}

/** Creates a client when `client` is null, and renames it otherwise. */
export interface ClientDialogProps {
  open: boolean
  client: ClientItem | null
  onClose: () => void
  onSaved: () => void
}
