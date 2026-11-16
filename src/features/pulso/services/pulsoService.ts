import { PULSO_API_BASE_URL } from '@/config/env'
import { assignAccess, listAccessBySystem, removeAccess } from '@/features/access'
import { listSystems } from '@/features/systems'
import { createUser, listUsers } from '@/features/users'
import { request } from '@/services/httpClient'
import type {
  Branch,
  BranchInput,
  BranchResponse,
  NewMemberInput,
  PulsoGroup,
  GymStatus,
  PulsoGroupListResponse,
  PulsoModuleResponse,
  PulsoTeam,
} from '../types/pulso.types'

const ADMIN_PATH = '/api/v1/admin'
const PULSO_SYSTEM_CODE = 'pulso'
/** The colour Pulso gives a gym until its brand colour is chosen. */
const DEFAULT_BRAND_COLOR = '#17677b'

function toBranch(branch: BranchResponse): Branch {
  return { id: branch.id, name: branch.name, address: branch.address ?? '' }
}

export async function listPulsoGroups(signal?: AbortSignal): Promise<PulsoGroup[]> {
  const { data } = await request<PulsoGroupListResponse>(`${ADMIN_PATH}/groups`, { baseUrl: PULSO_API_BASE_URL, signal })
  return data.map((group) => ({
    id: group.id,
    name: group.name,
    gyms: group.gyms.map((gym) => ({
      id: gym.id,
      groupId: gym.group_id,
      tenantId: gym.auth_tenant_id,
      authClientId: gym.auth_client_id,
      ruc: gym.ruc ?? '',
      name: gym.name,
      brandColor: gym.brand_color || DEFAULT_BRAND_COLOR,
      features: gym.features ?? [],
      status: gym.status ?? 'active',
      branches: gym.branches.map(toBranch),
    })),
  }))
}

export async function updateGymColor(gymId: string, brandColor: string): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}`, { method: 'PATCH', body: { brand_color: brandColor }, baseUrl: PULSO_API_BASE_URL })
}

/** Replaces the optional modules of a gym (the complete list: what is not sent is switched off). */
export async function updateGymFeatures(gymId: string, features: string[]): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}/features`, { method: 'PATCH', body: { features }, baseUrl: PULSO_API_BASE_URL })
}

/** Suspending locks the gym's people out of Pulso at once; reactivating lets them back in. Nothing is deleted. */
export async function updateGymStatus(gymId: string, status: GymStatus): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}/status`, { method: 'PATCH', body: { status }, baseUrl: PULSO_API_BASE_URL })
}

/** What Pulso can do: the base modules every gym has and the optional ones switched on per gym. */
export async function listPulsoModules(signal?: AbortSignal): Promise<PulsoModuleResponse[]> {
  const { data } = await request<{ data: PulsoModuleResponse[] }>(`${ADMIN_PATH}/modules`, { baseUrl: PULSO_API_BASE_URL, signal })
  return data
}

export async function createBranch(gymId: string, input: BranchInput): Promise<Branch> {
  const { data } = await request<{ data: BranchResponse }>(`${ADMIN_PATH}/gyms/${gymId}/branches`, {
    method: 'POST',
    body: { name: input.name, address: input.address || null },
    baseUrl: PULSO_API_BASE_URL,
  })
  return toBranch(data)
}

export async function updateBranch(branchId: string, input: BranchInput): Promise<Branch> {
  const { data } = await request<{ data: BranchResponse }>(`${ADMIN_PATH}/branches/${branchId}`, {
    method: 'PATCH',
    body: { name: input.name, address: input.address || null },
    baseUrl: PULSO_API_BASE_URL,
  })
  return toBranch(data)
}

export async function deleteBranch(branchId: string): Promise<void> {
  await request<void>(`${ADMIN_PATH}/branches/${branchId}`, { method: 'DELETE', baseUrl: PULSO_API_BASE_URL })
}

/** The people with access to any company in the `pulso` system. Each gym filters them by its company. */
export async function listPulsoTeam(signal?: AbortSignal): Promise<PulsoTeam> {
  const system = (await listSystems(signal)).find((item) => item.code === PULSO_SYSTEM_CODE)
  if (!system) return { systemId: null, members: [] }
  return { systemId: system.id, members: await listAccessBySystem(system.id, signal) }
}

/** Gives a person access to the gym's company, creating their account by document when it does not exist. */
export async function addMember(input: NewMemberInput): Promise<void> {
  // Numbers are unique across document types, so the number alone finds the account.
  const existing = (await listUsers()).find((user) => user.documentNumber === input.documentNumber)
  const user = existing ?? (await createUser({ documentType: input.documentType, documentNumber: input.documentNumber, fullName: input.fullName }))
  // Pulso admins always manage their own team (they create their receptionists).
  await assignAccess({ userId: user.id, systemId: input.systemId, tenantId: input.tenantId, role: input.role, manageUsers: input.role === 'admin' })
}

export async function removeMember(accessId: string): Promise<void> {
  await removeAccess(accessId)
}
