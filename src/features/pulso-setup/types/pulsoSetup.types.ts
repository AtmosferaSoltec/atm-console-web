import type { LucideIcon } from 'lucide-react'
import type { ClientItem } from '@/features/clients'
import type { Branch, GymStatus, TeamMember } from '@/features/pulso/types/pulso.types'
import type { TenantItem } from '@/features/tenants'
import type { UserDocumentType, UserItem } from '@/features/users'

/** Base: every company has it. Optional: the platform switches it on per company. */
export type ModuleKind = 'base' | 'optional'

/** A module of the catalog pulso-api publishes, with the Spanish name and description the console gives it. */
export interface PulsoModule {
  code: string
  name: string
  description: string
  kind: ModuleKind
  switchable: boolean
  icon: LucideIcon
  /** Codes that must be switched on before this one. */
  requires: string[]
  /** What the gym gets, in short sentences, for the catalog. */
  includes: string[]
}

/** How the console presents a module code it knows. Codes it does not know show as they come. */
export interface ModuleInfo {
  name: string
  description: string
  icon: LucideIcon
  includes: string[]
}

export type TeamRole = 'admin' | 'receptionist'

/** A gym of Pulso seen as a company of a client: the gym, its company in auth-api and its people. */
export interface Company {
  /** The gym id in pulso-api. */
  id: string
  /** The company in auth-api the gym comes from. */
  tenantId: string
  clientId: string
  tradeName: string
  /** '' when the company has no RUC. */
  ruc: string
  brandColor: string
  status: GymStatus
  branches: Branch[]
  /** Codes of the optional modules switched on. Base modules are implicit. */
  modules: string[]
  team: TeamMember[]
  /** The company in auth-api, for its profile; undefined when the console cannot see it. */
  tenant: TenantItem | undefined
}

export interface ClientSummary {
  id: string
  name: string
  companies: Company[]
  branchCount: number
}

/** Everything the Pulso administration shows, loaded at once. */
export interface PulsoAdminData {
  clients: ClientSummary[]
  companies: Company[]
  /** Every client of auth-api, also those without Pulso, to add Pulso to one of them. */
  authClients: ClientItem[]
  modules: PulsoModule[]
  /** Every account of Atmósfera, to pick a gym's administrator. */
  users: UserItem[]
  /** Id of the `pulso` system in auth-api, or null when it is not in the catalog. */
  systemId: string | null
}

export interface PulsoAdminQuery {
  data: PulsoAdminData | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

/* ---------- New client wizard ---------- */

export interface DraftBranch {
  key: string
  name: string
}

export interface DraftCompany {
  key: string
  tradeName: string
  ruc: string
  branches: DraftBranch[]
  modules: string[]
  /** The first administrator, or null to leave it for later. */
  admin: AdminChoice | null
}

/** A gym's administrator: an existing account of Atmósfera, or a new one made from these fields. */
export interface AdminChoice {
  /** The existing account, or null to create it. */
  userId: string | null
  documentType: UserDocumentType
  documentNumber: string
  fullName: string
}

export interface AdminPickerProps {
  users: UserItem[]
  value: AdminChoice | null
  onChange: (value: AdminChoice | null) => void
  /** Prefix of the ids of its fields, unique in the page. */
  idPrefix: string
}

export interface ClientDraft {
  /** The client of auth-api that gets Pulso. Clients are created only in the Clients section of the console. */
  clientId: string | null
  companies: DraftCompany[]
}

/** Where a creation got to, for the progress message. */
export type CreationStep = (message: string) => void

/* ---------- Component props ---------- */

export interface ClientCardProps {
  summary: ClientSummary
  modules: PulsoModule[]
  onAddCompany: (clientId: string) => void
}

export interface NewClientWizardProps {
  data: PulsoAdminData
  onCancel: () => void
  /** Receives the first company created, to open it. */
  onCreated: (companyId: string) => void
}

export interface AddCompanyDialogProps {
  client: ClientSummary | null
  data: PulsoAdminData
  onClose: () => void
  onCreated: (companyId: string) => void
}

export interface AddCompanyFormProps {
  client: ClientSummary
  data: PulsoAdminData
  onClose: () => void
  onCreated: (companyId: string) => void
}

export interface ModuleToggleRowProps {
  module: PulsoModule
  enabled: boolean
  busy: boolean
  /** Names of the modules that must be on first; empty when it can be switched. */
  missing: string[]
  /** Names of the modules this one needs, for the hint. */
  needs: string[]
  onToggle: (module: PulsoModule, next: boolean) => void
}

export interface CompanyTabProps {
  company: Company
  data: PulsoAdminData
  onChanged: () => void
}

export interface BranchDialogProps {
  open: boolean
  companyId: string
  branch: Branch | null
  onClose: () => void
  onSaved: () => void
}

export interface BranchFormProps {
  companyId: string
  branch: Branch | null
  onClose: () => void
  onSaved: () => void
}

export interface TeamMemberDialogProps {
  open: boolean
  company: Company
  systemId: string
  /** Accounts of Atmósfera to pick from. */
  users: UserItem[]
  onClose: () => void
  onSaved: () => void
}

export interface TeamMemberFormProps {
  company: Company
  systemId: string
  /** Accounts of Atmósfera to pick from. */
  users: UserItem[]
  onClose: () => void
  onSaved: () => void
}

export interface GymPreviewProps {
  company: Company
  modules: PulsoModule[]
}

export interface ModuleCatalogProps {
  data: PulsoAdminData
}

export interface ModulePickerProps {
  modules: PulsoModule[]
  selected: string[]
  onChange: (codes: string[]) => void
}

export interface CompanyDraftFieldsProps {
  draft: DraftCompany
  /** Position in the wizard, for the heading; omit for a single company. */
  index?: number
  onChange: (draft: DraftCompany) => void
  onRemove?: () => void
}

export interface CompanyDetail {
  company: Company
  client: ClientSummary
  /** Every company of the same client, for the switcher. */
  siblings: Company[]
}

/** A sidebar entry of atm-pulso-web, for the preview. */
export interface PreviewLink {
  label: string
  icon: LucideIcon
  /** The module that has to be on; omitted for pages every gym has. */
  module?: string
  adminOnly?: boolean
}

export interface LoadStateProps {
  error: string | null
  onRetry: () => void
}

export interface CompanyAvatarProps {
  /** Id of the logo in the storage API, or '' when the company has none. */
  logoFileId: string
  /** Trade name: the image description and the source of the monogram. */
  name: string
  /** Brand colour behind the monogram. */
  color: string
  /** Size and text classes of the square. */
  className?: string
}

export interface ColorFieldProps {
  /** Saved colour as "#rrggbb". */
  value: string
  /** Saves the colour; resolves true when it was saved. */
  onSave: (color: string) => Promise<boolean>
  busy: boolean
  error: string | null
}
