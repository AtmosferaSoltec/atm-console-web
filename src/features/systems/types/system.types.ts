/** Whether users stay signed in (persistent) or must sign in again after some inactivity (temporary). */
export type SessionMode = 'persistent' | 'temporary'

export interface SystemItem {
  id: string
  code: string
  name: string
  sessionMode: SessionMode
  /** Inactivity limit of a temporary session, and 0 for a persistent one. */
  sessionMinutes: number
  /** Whether the system has a credential to ask for service tokens. The secret itself is never returned. */
  hasSecret: boolean
  /** ISO 8601 timestamps, or null when there is no credential or it was never used. */
  secretCreatedAt: string | null
  secretLastUsedAt: string | null
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface SystemResponse {
  id: string
  code: string
  name: string
  session_mode: SessionMode
  session_minutes: number
  has_secret: boolean
  secret_created_at?: string
  secret_last_used_at?: string
  created_at: string
}

export interface SystemListResponse {
  items: SystemResponse[]
}

export interface SessionPolicy {
  mode: SessionMode
  /** 0 for a persistent session. */
  minutes: number
}

export interface CreateSystemInput {
  code: string
  name: string
  session: SessionPolicy
}

export interface SystemsListProps {
  systems: SystemItem[]
  isLoading: boolean
  error: string | null
}

export interface SessionPolicyFieldsProps {
  /** Prefix for the ids of the inputs, so two forms on a page do not clash. */
  idPrefix: string
  mode: SessionMode
  minutes: string
  onModeChange: (mode: SessionMode) => void
  onMinutesChange: (minutes: string) => void
}

export interface SessionBadgeProps {
  mode: SessionMode
  minutes: number
}

export interface SystemSessionCardProps {
  system: SystemItem
  /** Called after the policy changed, so the list can reload. */
  onChanged: () => void
}

/** A credential just generated. The secret is shown once and cannot be recovered. */
export interface IssuedSecret {
  clientId: string
  clientSecret: string
}

export interface SystemCredentialsCardProps {
  system: SystemItem
  /** Called after the credential changed, so the system can reload. */
  onChanged: () => void
}

export interface DeleteSystemDialogProps {
  system: SystemItem
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

export interface SystemDangerZoneProps {
  system: SystemItem
  onDeleted: () => void
}

export interface SystemSummaryProps {
  system: SystemItem
}

export interface CreateSystemDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}
