import type { AccessItem } from '@/features/access'
import type { TenantItem } from '@/features/tenants'

export interface BranchResponse {
  id: string
  name: string
  address: string | null
}

export interface GymResponse {
  id: string
  group_id: string
  auth_tenant_id: string
  auth_client_id: string
  /** Null or empty while the company has no RUC. */
  ruc: string | null
  name: string
  brand_color: string
  /** Optional modules switched on for the gym. */
  features?: string[]
  branches: BranchResponse[]
}

export interface PulsoGroupResponse {
  id: string
  name: string
  gyms: GymResponse[]
}

export interface PulsoGroupListResponse {
  data: PulsoGroupResponse[]
}

export interface Branch {
  id: string
  name: string
  address: string
}

export interface Gym {
  id: string
  groupId: string
  /** The company in the auth API this gym comes from. */
  tenantId: string
  /** The client in the auth API that owns that company. */
  authClientId: string
  /** '' when the company has no RUC. */
  ruc: string
  name: string
  brandColor: string
  /** Codes of the optional modules switched on: sales, body_tracking, kiosk. */
  features: string[]
  branches: Branch[]
}

/** An internal label that bundles related gyms. It is not a user. */
export interface PulsoGroup {
  id: string
  name: string
  gyms: Gym[]
}

export interface BranchInput {
  name: string
  address: string
}

/** A person with access to a gym in the `pulso` system. */
export type TeamMember = AccessItem

export interface PulsoTeam {
  /** Id of the `pulso` system in the auth API, or null when it is not in the catalog. */
  systemId: string | null
  members: TeamMember[]
}

export interface NewMemberInput {
  systemId: string
  tenantId: string
  dni: string
  fullName: string
  role: string
}

export interface NewGymInput {
  systemId: string
  /** The group the gym must end up in. */
  groupId: string
  /** The client in the auth API whose company becomes the gym. */
  authClientId: string
  name: string
}

export interface BranchDialogProps {
  open: boolean
  /** The gym that receives a new branch; ignored when `branch` is set. */
  gym: Gym | null
  /** The branch being renamed, or null to create one. */
  branch: Branch | null
  onClose: () => void
  onSaved: () => void
}

export interface NewGymDialogProps {
  /** The group that receives the gym, or null when the dialog is closed. */
  group: PulsoGroup | null
  systemId: string | null
  onClose: () => void
  onSaved: () => void
}

/** Creates a group when `group` is null, and renames it otherwise. */
export interface GroupDialogProps {
  open: boolean
  group: PulsoGroup | null
  onClose: () => void
  onSaved: () => void
}

export interface MoveGymDialogProps {
  /** The gym being moved, or null when the dialog is closed. */
  gym: Gym | null
  groups: PulsoGroup[]
  onClose: () => void
  onSaved: () => void
}

export interface MemberDialogProps {
  /** The gym that receives the person, or null when the dialog is closed. */
  gym: Gym | null
  systemId: string | null
  onClose: () => void
  onSaved: () => void
}

export interface GymColorFieldProps {
  gym: Gym
  onSaved: () => void
}

export interface GymFeaturesFieldProps {
  gym: Gym
  onSaved: () => void
}

export interface GymPanelProps {
  gym: Gym
  /** The company behind the gym, for its profile dialog; undefined while companies load. */
  tenant: TenantItem | undefined
  members: TeamMember[]
  onEditCompany: (tenant: TenantItem) => void
  onMoveGym: (gym: Gym) => void
  onAddBranch: (gym: Gym) => void
  onEditBranch: (branch: Branch) => void
  onDeleteBranch: (branch: Branch) => void
  onAddMember: (gym: Gym) => void
  onRemoveMember: (member: TeamMember) => void
  onChanged: () => void
}

export interface PulsoGroupsListProps {
  groups: PulsoGroup[]
  team: PulsoTeam
  isLoading: boolean
  error: string | null
  onChanged: () => void
  onTeamChanged: () => void
}
