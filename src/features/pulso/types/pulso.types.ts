import type { AccessItem } from '@/features/access'
import type { UserDocumentType } from '@/features/users'

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
  /** 'suspended' locks every person of the gym out of Pulso. */
  status: GymStatus
  branches: BranchResponse[]
}

export type GymStatus = 'active' | 'suspended'

/** An entry of the catalog pulso-api publishes. The console names each code in Spanish. */
export interface PulsoModuleResponse {
  code: string
  kind: 'base' | 'optional'
  /** The platform switches it on per gym. */
  switchable: boolean
  requires: string[]
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
  /** Codes of the optional modules switched on (base modules are not listed). */
  features: string[]
  status: GymStatus
  branches: Branch[]
}

/** pulso-api keeps one group per client; the console shows clients instead. */
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
  documentType: UserDocumentType
  documentNumber: string
  fullName: string
  role: string
}

/** A product category of a gym as pulso-api answers it to the console (with how many products it has). */
export interface ProductCategoryResponse {
  id: string
  name: string
  position: number
  product_count?: number
}

export interface ProductCategory {
  id: string
  name: string
  position: number
  /** Products (on sale or retired) in this category: deleting it leaves them without one. */
  productCount: number
}

/** The answer to a bulk creation: what was created and the names skipped (the gym had them, or repeated). */
export interface ProductCategoriesAdded {
  created: ProductCategory[]
  skipped: string[]
}
