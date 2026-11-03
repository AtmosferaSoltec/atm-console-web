import type { EntityStatus } from '@/types/common.types'

/** The code the auth API gives Orbita. It is declared there, in the catalog of systems. */
export const ORBITA_SYSTEM_CODE = 'orbita'

/** A person with access to Orbita: who they are (from the access) and the state of their account (from the user). */
export interface OrbitaPerson {
  userId: string
  name: string
  email: string
  /** Null when the account is not in the users list, so its state is unknown. */
  status: EntityStatus | null
  /** ISO 8601 timestamp. */
  joinedAt: string
}

export interface OrbitaPeopleSummary {
  total: number
  active: number
  disabled: number
}

export interface OrbitaPeopleListProps {
  people: OrbitaPerson[]
  isLoading: boolean
  error: string | null
  /** Called after an account changed, so the list can reload. */
  onChanged: () => void
}
