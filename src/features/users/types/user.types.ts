import type { AccessItem } from '@/features/access'
import type { SystemItem } from '@/features/systems'
import type { EntityStatus } from '@/types/common.types'

/** How atm-auth-api identifies a person: DNI, carné de extranjería or passport (or any other foreign ID). */
export type UserDocumentType = 'dni' | 'ce' | 'passport'

export interface UserItem {
  id: string
  /** Empty when the account has no document (superadmins). */
  documentType: UserDocumentType | ''
  /** The number the person signs in with; empty when the account has none. */
  documentNumber: string
  /** Empty when the account has none. */
  email: string
  fullName: string
  status: EntityStatus
  /** True while the account still has its initial password (the document number). */
  mustChangePassword: boolean
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface UserResponse {
  id: string
  document_type?: UserDocumentType | ''
  document_number?: string
  /** Deprecated by the API: the same number as document_number. */
  dni?: string
  email?: string
  full_name: string
  status: EntityStatus
  must_change_password: boolean
  created_at: string
}

export interface UserListResponse {
  items: UserResponse[]
}

export interface CreateUserInput {
  documentType: UserDocumentType
  documentNumber: string
  fullName: string
}

export interface DocumentFieldsProps {
  /** Prefix of the ids of the two fields, unique in the form. */
  idPrefix: string
  documentType: UserDocumentType
  documentNumber: string
  onDocumentTypeChange: (documentType: UserDocumentType) => void
  onDocumentNumberChange: (documentNumber: string) => void
  /** Shown under the number, after its rule. */
  hint?: string
  autoFocus?: boolean
}

export interface UsersListProps {
  users: UserItem[]
  isLoading: boolean
  error: string | null
  /** Accesses of all systems; they tell which users belong to which system and company. */
  access: AccessItem[]
  systems: SystemItem[]
  isAccessLoading: boolean
  accessError: string | null
}

export interface UserSummaryProps {
  user: UserItem
}

export interface UserActionsProps {
  user: UserItem
  /** Called after the account changed, so the list can reload. */
  onChanged: () => void
}

export interface CreateUserDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}
