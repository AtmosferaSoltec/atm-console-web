export interface BranchResponse {
  id: string
  name: string
  address: string | null
}

export interface GymResponse {
  id: string
  auth_tenant_id: string
  ruc: string
  name: string
  branches: BranchResponse[]
}

export interface PulsoClientResponse {
  id: string
  auth_client_id: string
  name: string
  gyms: GymResponse[]
}

export interface PulsoClientListResponse {
  data: PulsoClientResponse[]
}

export interface Branch {
  id: string
  name: string
  address: string
}

export interface Gym {
  id: string
  ruc: string
  name: string
  branches: Branch[]
}

export interface PulsoClient {
  id: string
  name: string
  gyms: Gym[]
}

export interface BranchInput {
  name: string
  address: string
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

export interface PulsoClientsListProps {
  clients: PulsoClient[]
  isLoading: boolean
  error: string | null
  onChanged: () => void
}
