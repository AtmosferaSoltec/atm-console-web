export type SessionStatus = 'pending_qr' | 'connected' | 'disconnected' | 'banned'

export interface Session {
  id: string
  clientName: string
  accountRef: string
  status: SessionStatus
  /** Digits only, international format. Null until the number is linked. */
  phone: string | null
  lastConnection: string | null
}

export interface SessionsTableProps {
  sessions: Session[]
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
}

export interface ConnectLinkDialogProps {
  session: Session | null
  onClose: () => void
}
