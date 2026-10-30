import { PULSO_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type { Branch, BranchInput, BranchResponse, PulsoClient, PulsoClientListResponse } from '../types/pulso.types'

const ADMIN_PATH = '/api/v1/admin'

function toBranch(branch: BranchResponse): Branch {
  return { id: branch.id, name: branch.name, address: branch.address ?? '' }
}

export async function listPulsoClients(signal?: AbortSignal): Promise<PulsoClient[]> {
  const { data } = await request<PulsoClientListResponse>(`${ADMIN_PATH}/clients`, { baseUrl: PULSO_API_BASE_URL, signal })
  return data.map((client) => ({
    id: client.id,
    name: client.name,
    gyms: client.gyms.map((gym) => ({ id: gym.id, ruc: gym.ruc, name: gym.name, branches: gym.branches.map(toBranch) })),
  }))
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
