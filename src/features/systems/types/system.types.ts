/** Whether the system remembers its users (persistent) or asks them to sign in again when they come back (temporary). */
export type SessionMode = 'persistent' | 'temporary'

export interface SystemItem {
  id: string
  code: string
  name: string
  sessionMode: SessionMode
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
  has_secret: boolean
  secret_created_at?: string
  secret_last_used_at?: string
  created_at: string
}

export interface SystemListResponse {
  items: SystemResponse[]
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
  onModeChange: (mode: SessionMode) => void
}

export interface SessionBadgeProps {
  mode: SessionMode
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

export interface SystemSummaryProps {
  system: SystemItem
}
