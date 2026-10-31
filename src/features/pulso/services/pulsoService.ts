import { PULSO_API_BASE_URL } from '@/config/env'
import { assignAccess, listAccessBySystem, removeAccess } from '@/features/access'
import { listSystems } from '@/features/systems'
import { createTenant, enableTenantSystem } from '@/features/tenants'
import { createUser, listUsers } from '@/features/users'
import { request } from '@/services/httpClient'
import type {
  Branch,
  BranchInput,
  BranchResponse,
  NewGymInput,
  NewMemberInput,
  PulsoGroup,
  PulsoGroupListResponse,
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
      branches: gym.branches.map(toBranch),
    })),
  }))
}

export async function createGroup(name: string): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/groups`, { method: 'POST', body: { name }, baseUrl: PULSO_API_BASE_URL })
}

export async function renameGroup(groupId: string, name: string): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/groups/${groupId}`, { method: 'PATCH', body: { name }, baseUrl: PULSO_API_BASE_URL })
}

/** Pulso refuses (409 GROUP_IN_USE) while the group still has gyms. */
export async function deleteGroup(groupId: string): Promise<void> {
  await request<void>(`${ADMIN_PATH}/groups/${groupId}`, { method: 'DELETE', baseUrl: PULSO_API_BASE_URL })
}

export async function moveGym(gymId: string, groupId: string): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}`, { method: 'PATCH', body: { group_id: groupId }, baseUrl: PULSO_API_BASE_URL })
}

export async function updateGymColor(gymId: string, brandColor: string): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}`, { method: 'PATCH', body: { brand_color: brandColor }, baseUrl: PULSO_API_BASE_URL })
}

/** Replaces the optional modules of a gym (the complete list: what is not sent is switched off). */
export async function updateGymFeatures(gymId: string, features: string[]): Promise<void> {
  await request<unknown>(`${ADMIN_PATH}/gyms/${gymId}/features`, { method: 'PATCH', body: { features }, baseUrl: PULSO_API_BASE_URL })
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

/**
 * A gym is a company of an auth client with Pulso enabled. Pulso records the gym itself, with its main branch, the
 * next time the groups are listed, and puts it in the group of any gym of the same client (or a new group). So
 * the groups are listed once to find the new gym and move it to the chosen group when it landed elsewhere.
 * The company needs only a name: it has no RUC.
 */
export async function createGym(input: NewGymInput): Promise<void> {
  const tenant = await createTenant({ ruc: '', legalName: input.name, tradeName: '', clientId: input.authClientId })
  await enableTenantSystem(tenant.id, input.systemId)
  const gym = (await listPulsoGroups()).flatMap((group) => group.gyms).find((item) => item.tenantId === tenant.id)
  if (gym && gym.groupId !== input.groupId) await moveGym(gym.id, input.groupId)
}

/** Gives a person access to the gym's company, creating their account by DNI when it does not exist. */
export async function addMember(input: NewMemberInput): Promise<void> {
  const existing = (await listUsers()).find((user) => user.dni === input.dni)
  const user = existing ?? (await createUser({ dni: input.dni, fullName: input.fullName }))
  // Pulso admins always manage their own team (they create their receptionists).
  await assignAccess({ userId: user.id, systemId: input.systemId, tenantId: input.tenantId, role: input.role, manageUsers: input.role === 'admin' })
}

export async function removeMember(accessId: string): Promise<void> {
  await removeAccess(accessId)
}
