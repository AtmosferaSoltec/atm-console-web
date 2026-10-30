export type SessionStatus = 'pending_qr' | 'connected' | 'disconnected' | 'banned'

export interface Session {
  id: string
  tenantId: string
  /** Name of the system the connection belongs to; '—' while the systems are loading. */
  clientName: string
  accountRef: string
  status: SessionStatus
  /** Digits only, international format. Null until the number is linked. */
  phone: string | null
  /** ISO date of the last time the number was linked, or null if it never was. */
  connectedAt: string | null
}

export interface SessionResponse {
  id: string
  tenant_id: string
  account_ref: string
  channel: string
  status: SessionStatus
  phone: string
  connected_at: string | null
  created_at: string
}

export interface ConnectLink {
  url: string
  label: string
  expiresAt: string
}

export interface ConnectLinkResponse {
  url: string
  label: string
  expires_at: string
}

export interface CreateSessionInput {
  /** Code of the system in the auth API. */
  systemCode: string
  accountRef: string
}

export interface SessionsTableProps {
  sessions: Session[]
  isLoading: boolean
  error: string | null
  onGenerateLink: (session: Session) => void
  onSendMessage: (session: Session) => void
  onDisconnect: (session: Session) => void
  onDelete: (session: Session) => void
}

export interface SessionStatusBadgeProps {
  status: SessionStatus
}

export interface AccountAvatarProps {
  name: string
}

export interface CreateSessionDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export interface ConnectLinkDialogProps {
  session: Session | null
  onClose: () => void
}
